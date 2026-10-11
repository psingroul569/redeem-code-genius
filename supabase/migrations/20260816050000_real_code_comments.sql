-- Replaces the client-side fake comment generator (useAutoComments.ts, which
-- invented testimony like "Just claimed 500 Diamonds! Working perfectly" from
-- a rotating pool of fake gamer names, and reassigned a random fake name to
-- real visitors who actually commented) with real, persisted comments.

CREATE TABLE public.code_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id UUID NOT NULL REFERENCES public.synced_codes(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Player',
  text TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT code_comments_text_length CHECK (char_length(text) BETWEEN 1 AND 500),
  CONSTRAINT code_comments_name_length CHECK (char_length(display_name) BETWEEN 1 AND 40)
);

CREATE INDEX idx_code_comments_code_id ON public.code_comments (code_id, created_at DESC);

ALTER TABLE public.code_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON public.code_comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can post a comment"
  ON public.code_comments FOR INSERT
  WITH CHECK (true);

-- One like per (comment, visitor) — same anonymous-dedup pattern as code_votes.
CREATE TABLE public.comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.code_comments(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (comment_id, visitor_id)
);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comment likes"
  ON public.comment_likes FOR SELECT
  USING (true);

-- Direct insert/delete on comment_likes is not exposed — all writes go
-- through toggle_comment_like() so the like count on code_comments always
-- matches the dedup table.

CREATE OR REPLACE FUNCTION public.toggle_comment_like(p_comment_id UUID, p_visitor_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_liked BOOLEAN;
  v_likes INTEGER;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.comment_likes WHERE comment_id = p_comment_id AND visitor_id = p_visitor_id
  ) INTO v_liked;

  IF v_liked THEN
    DELETE FROM public.comment_likes WHERE comment_id = p_comment_id AND visitor_id = p_visitor_id;
    UPDATE public.code_comments SET likes = GREATEST(0, likes - 1) WHERE id = p_comment_id;
  ELSE
    INSERT INTO public.comment_likes (comment_id, visitor_id) VALUES (p_comment_id, p_visitor_id);
    UPDATE public.code_comments SET likes = likes + 1 WHERE id = p_comment_id;
  END IF;

  SELECT likes INTO v_likes FROM public.code_comments WHERE id = p_comment_id;
  RETURN v_likes;
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_comment_like(UUID, TEXT) TO anon, authenticated;
