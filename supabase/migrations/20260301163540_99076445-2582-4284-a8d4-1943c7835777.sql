
-- Drop the restrictive policies and recreate as permissive

-- synced_codes
DROP POLICY IF EXISTS "Anyone can read synced codes" ON public.synced_codes;
CREATE POLICY "Anyone can read synced codes"
  ON public.synced_codes
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can insert synced codes" ON public.synced_codes;
CREATE POLICY "Service role can insert synced codes"
  ON public.synced_codes
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update synced codes" ON public.synced_codes;
CREATE POLICY "Service role can update synced codes"
  ON public.synced_codes
  FOR UPDATE
  USING (true);

-- sync_log
DROP POLICY IF EXISTS "Anyone can read sync log" ON public.sync_log;
CREATE POLICY "Anyone can read sync log"
  ON public.sync_log
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can insert sync log" ON public.sync_log;
CREATE POLICY "Service role can insert sync log"
  ON public.sync_log
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update sync log" ON public.sync_log;
CREATE POLICY "Service role can update sync log"
  ON public.sync_log
  FOR UPDATE
  USING (true);
