
-- Enable required extensions for cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Table to store synced codes per region per hour
CREATE TABLE public.synced_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  hour_key TEXT NOT NULL,
  code TEXT NOT NULL,
  reward TEXT NOT NULL DEFAULT 'Garena Reward',
  category TEXT NOT NULL DEFAULT 'Bundle',
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Working',
  probability INTEGER NOT NULL DEFAULT 85,
  recent_claims INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  citations JSONB DEFAULT '[]'::jsonb,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast region + hour_key lookups
CREATE INDEX idx_synced_codes_region_hour ON public.synced_codes (region, hour_key);

-- Unique constraint to prevent duplicate codes per region per hour
CREATE UNIQUE INDEX idx_synced_codes_unique ON public.synced_codes (region, hour_key, code);

-- Track which region-hour combos have been synced
CREATE TABLE public.sync_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  hour_key TEXT NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  code_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(region, hour_key)
);

CREATE INDEX idx_sync_log_region ON public.sync_log (region, hour_key);

-- Enable RLS but allow public read (codes are public data)
ALTER TABLE public.synced_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read synced codes"
  ON public.synced_codes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read sync log"
  ON public.sync_log FOR SELECT
  USING (true);

-- Only service role can insert/update (edge functions use service role)
CREATE POLICY "Service role can insert synced codes"
  ON public.synced_codes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update synced codes"
  ON public.synced_codes FOR UPDATE
  USING (true);

CREATE POLICY "Service role can insert sync log"
  ON public.sync_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update sync log"
  ON public.sync_log FOR UPDATE
  USING (true);

-- Enable realtime for synced_codes so all users see updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.synced_codes;
