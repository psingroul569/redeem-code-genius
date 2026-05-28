
-- 1. profiles: restrict SELECT
DROP POLICY IF EXISTS "Users can read all profiles" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

-- 2. synced_codes: remove permissive insert/update (service_role bypasses RLS)
DROP POLICY IF EXISTS "Service role can insert synced codes" ON public.synced_codes;
DROP POLICY IF EXISTS "Service role can update synced codes" ON public.synced_codes;

-- 3. sync_log: same
DROP POLICY IF EXISTS "Service role can insert sync log" ON public.sync_log;
DROP POLICY IF EXISTS "Service role can update sync log" ON public.sync_log;

-- 4. storage media: tighten delete policy and remove public listing
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
CREATE POLICY "Admins or owners can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'media'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR owner = auth.uid()
    )
  );

-- Remove broad SELECT listing policy; public bucket files remain accessible via direct public URL
DROP POLICY IF EXISTS "Anyone can view media files" ON storage.objects;

-- 5. Restrict EXECUTE on has_role (still callable from RLS policies as definer-owned)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
