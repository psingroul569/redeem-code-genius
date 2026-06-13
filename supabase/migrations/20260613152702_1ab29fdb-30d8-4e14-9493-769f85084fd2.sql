
-- 1. Restrict storage.objects INSERT on 'media' bucket to admins/editors
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Admins and editors can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media'
  AND (public.has_role(auth.uid(), 'admin'::public.app_role)
       OR public.has_role(auth.uid(), 'editor'::public.app_role))
);

-- 2. Restrict public.media INSERT to admins/editors (was WITH CHECK true)
DROP POLICY IF EXISTS "Authenticated can upload media" ON public.media;
CREATE POLICY "Admins and editors can insert media"
ON public.media
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'editor'::public.app_role)
);

-- 3. Allow post authors to read revisions of their own posts
CREATE POLICY "Authors can read own post revisions"
ON public.post_revisions
FOR SELECT
TO authenticated
USING (
  revised_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = post_revisions.post_id
      AND p.author_id = auth.uid()
  )
);
