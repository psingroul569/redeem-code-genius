-- Support for admin-entered codes alongside the AI-discovered ones.
--
-- The existing sync pipeline buckets codes by (region, hour_key) — fine for
-- AI runs that fire every hour, but a manually-entered code shouldn't vanish
-- the moment the next hour's AI sync creates a new hour_key bucket. Manual
-- codes get their own lifecycle: a source flag and an explicit expiry, and
-- are fetched independently of the hour_key bucketing.

ALTER TABLE public.synced_codes
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'ai',
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_synced_codes_manual_active
  ON public.synced_codes (region, source, status)
  WHERE source = 'manual';

-- Admins/editors can insert and update manual codes directly from the CMS.
CREATE POLICY "Admins and editors can insert manual codes"
  ON public.synced_codes FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update manual codes"
  ON public.synced_codes FOR UPDATE
  TO authenticated
  USING (source = 'manual' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')))
  WITH CHECK (source = 'manual' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "Admins and editors can delete manual codes"
  ON public.synced_codes FOR DELETE
  TO authenticated
  USING (source = 'manual' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));
