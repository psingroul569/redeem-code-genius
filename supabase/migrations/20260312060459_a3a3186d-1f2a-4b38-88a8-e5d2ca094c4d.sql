
-- ==========================================
-- CMS DATABASE SCHEMA - MVP
-- ==========================================

-- 1. User Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'author', 'moderator');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admins can see all roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 2. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage categories" ON public.categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 4. Tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage tags" ON public.tags
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 5. Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  visibility TEXT NOT NULL DEFAULT 'public',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_canonical TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  reading_time INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can read published posts" ON public.posts
  FOR SELECT USING (status = 'published' AND visibility = 'public');

-- Authenticated users with roles can manage posts
CREATE POLICY "Authors can manage own posts" ON public.posts
  FOR ALL TO authenticated
  USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Admins/editors can read all posts (including drafts)
CREATE POLICY "Admins can read all posts" ON public.posts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 6. Post Tags junction
CREATE TABLE public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (post_id, tag_id)
);
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read post_tags" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage post_tags" ON public.post_tags
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 7. Post Revisions
CREATE TABLE public.post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  revised_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.post_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins/editors can manage revisions" ON public.post_revisions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 8. Pages
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  seo_canonical TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  template TEXT DEFAULT 'default',
  sort_order INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published pages" ON public.pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins/editors can manage pages" ON public.pages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can read all pages" ON public.pages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 9. Media
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER DEFAULT 0,
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Authenticated can upload media" ON public.media
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage media" ON public.media
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid());

-- 10. Menus
CREATE TABLE public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL DEFAULT 'primary',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Admins can manage menus" ON public.menus
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 11. Menu Items
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '/',
  target TEXT DEFAULT '_self',
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage menu_items" ON public.menu_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 12. Site Settings
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site_settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 13. Redirects
CREATE TABLE public.redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  type INTEGER NOT NULL DEFAULT 301,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read redirects" ON public.redirects FOR SELECT USING (true);
CREATE POLICY "Admins can manage redirects" ON public.redirects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 14. Storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage RLS for media bucket
CREATE POLICY "Anyone can view media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

CREATE POLICY "Users can update own media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can delete media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');

-- 15. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
