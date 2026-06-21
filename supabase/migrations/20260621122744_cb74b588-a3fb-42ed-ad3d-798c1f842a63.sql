
-- Restrict posts insert/update to admins and editors only; tighten profiles update to exclude email changes

-- Drop the overly permissive ALL policy on posts
DROP POLICY IF EXISTS "Authors can manage own posts" ON public.posts;

-- Authors can read their own posts (any status); admins/editors can read all via separate policy
CREATE POLICY "Authors can view own posts"
ON public.posts FOR SELECT
TO authenticated
USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Only admins and editors can insert posts
CREATE POLICY "Admins and editors can insert posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Only admins and editors can update posts
CREATE POLICY "Admins and editors can update posts"
ON public.posts FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Only admins can delete posts
CREATE POLICY "Admins can delete posts"
ON public.posts FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Prevent users from changing their own email via profiles UPDATE
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (no email change)"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND email IS NOT DISTINCT FROM (SELECT email FROM public.profiles WHERE id = auth.uid()));
