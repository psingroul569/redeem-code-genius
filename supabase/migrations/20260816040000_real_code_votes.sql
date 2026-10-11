-- Replace fake, session-local like/dislike counts with real, persisted, deduped votes.
-- Also tightens synced_codes UPDATE/INSERT policies, which previously had no role
-- restriction (USING (true) / WITH CHECK (true) applies to the PUBLIC role, meaning
-- the anon key could directly rewrite live code data, not just the sync edge function).

ALTER TABLE public.synced_codes
  ADD COLUMN IF NOT EXISTS dislikes INTEGER NOT NULL DEFAULT 0;

-- One row per (code, visitor) so a single visitor can't stack votes.
-- visitor_id is a random id the client generates and stores in localStorage —
-- not identity, just anti-spam dedup for an anonymous, no-login vote.
CREATE TABLE IF NOT EXISTS public.code_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id UUID NOT NULL REFERENCES public.synced_codes(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  reaction TEXT NOT NULL CHECK (reaction IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (code_id, visitor_id)
);

ALTER TABLE public.code_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read vote rows"
  ON public.code_votes FOR SELECT
  USING (true);

-- Direct insert/update/delete on code_votes and on synced_codes counts is NOT
-- exposed to clients — all vote writes go through cast_code_vote() below, which
-- validates the reaction and enforces the one-vote-per-visitor-per-code rule
-- atomically. Anonymous clients get no other write path into either table.

CREATE OR REPLACE FUNCTION public.cast_code_vote(p_code_id UUID, p_visitor_id TEXT, p_reaction TEXT)
RETURNS TABLE(likes INTEGER, dislikes INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_previous TEXT;
BEGIN
  IF p_reaction NOT IN ('like', 'dislike') THEN
    RAISE EXCEPTION 'invalid reaction';
  END IF;

  SELECT reaction INTO v_previous
    FROM public.code_votes
    WHERE code_id = p_code_id AND visitor_id = p_visitor_id;

  IF v_previous IS NULL THEN
    INSERT INTO public.code_votes (code_id, visitor_id, reaction)
    VALUES (p_code_id, p_visitor_id, p_reaction);

    IF p_reaction = 'like' THEN
      UPDATE public.synced_codes SET likes = likes + 1 WHERE id = p_code_id;
    ELSE
      UPDATE public.synced_codes SET dislikes = dislikes + 1 WHERE id = p_code_id;
    END IF;
  ELSIF v_previous = p_reaction THEN
    -- Same button clicked again: undo the vote.
    DELETE FROM public.code_votes WHERE code_id = p_code_id AND visitor_id = p_visitor_id;

    IF p_reaction = 'like' THEN
      UPDATE public.synced_codes SET likes = GREATEST(0, likes - 1) WHERE id = p_code_id;
    ELSE
      UPDATE public.synced_codes SET dislikes = GREATEST(0, dislikes - 1) WHERE id = p_code_id;
    END IF;
  ELSE
    -- Switching from like to dislike or vice versa.
    UPDATE public.code_votes SET reaction = p_reaction, created_at = now()
      WHERE code_id = p_code_id AND visitor_id = p_visitor_id;

    IF p_reaction = 'like' THEN
      UPDATE public.synced_codes SET likes = likes + 1, dislikes = GREATEST(0, dislikes - 1) WHERE id = p_code_id;
    ELSE
      UPDATE public.synced_codes SET dislikes = dislikes + 1, likes = GREATEST(0, likes - 1) WHERE id = p_code_id;
    END IF;
  END IF;

  RETURN QUERY SELECT s.likes, s.dislikes FROM public.synced_codes s WHERE s.id = p_code_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cast_code_vote(UUID, TEXT, TEXT) TO anon, authenticated;

-- --- Security fix: synced_codes writes were open to any client (PUBLIC role) ---
DROP POLICY IF EXISTS "Service role can insert synced codes" ON public.synced_codes;
DROP POLICY IF EXISTS "Service role can update synced codes" ON public.synced_codes;

CREATE POLICY "Service role can insert synced codes"
  ON public.synced_codes FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update synced codes"
  ON public.synced_codes FOR UPDATE
  TO service_role
  USING (true);
