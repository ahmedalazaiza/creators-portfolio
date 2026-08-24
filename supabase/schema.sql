-- ==============================================================================
-- Portfolios - Complete Production Database Schema & Setup
-- (100% Idempotent, Safe, and Ready to Copy-Paste into Supabase SQL Editor)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Tables Definition
-- ==============================================================================

-- 2.1 Profiles Table (Linked 1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  banner_url TEXT DEFAULT 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  location TEXT,
  website TEXT,
  available_for_work BOOLEAN DEFAULT true,
  skills TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}'::jsonb,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  total_appreciations INT DEFAULT 0,
  total_views INT DEFAULT 0,
  is_email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Categories Taxonomy Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0
);

-- 2.3 Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  accent_color TEXT DEFAULT '#CDF22B',
  year TEXT DEFAULT '2025',
  tools TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  content_blocks JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  appreciations_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.4 Project Images (Supporting multiple high-res gallery images per project)
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 Appreciations (Likes) Table
CREATE TABLE IF NOT EXISTS public.appreciations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, project_id)
);

-- 2.6 Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.7 Follows Table (Social Connections)
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY(follower_id, following_id),
  CHECK (follower_id <> following_id)
);

-- 2.8 Favorites (Saved Projects / Moodboard) Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, project_id)
);

-- 2.9 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('appreciation', 'comment', 'follow', 'inquiry', 'curated')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_appreciations_project_id ON public.appreciations(project_id);
CREATE INDEX IF NOT EXISTS idx_appreciations_user_id ON public.appreciations(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON public.comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_project_id ON public.favorites(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ==============================================================================
-- 4. Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appreciations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles RLS
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4.2 Categories RLS
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- 4.3 Projects RLS
DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON public.projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

CREATE POLICY "Published projects are viewable by everyone" ON public.projects 
  FOR SELECT USING (status = 'published' OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON public.projects 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects 
  FOR DELETE USING (auth.uid() = user_id);

-- 4.4 Project Images RLS
DROP POLICY IF EXISTS "Project images are viewable by everyone" ON public.project_images;
DROP POLICY IF EXISTS "Project owners can insert images" ON public.project_images;
DROP POLICY IF EXISTS "Project owners can delete images" ON public.project_images;

CREATE POLICY "Project images are viewable by everyone" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Project owners can insert images" ON public.project_images 
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_images.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Project owners can delete images" ON public.project_images 
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_images.project_id AND projects.user_id = auth.uid()));

-- 4.5 Appreciations RLS
DROP POLICY IF EXISTS "Appreciations are viewable by everyone" ON public.appreciations;
DROP POLICY IF EXISTS "Authenticated users can appreciate" ON public.appreciations;
DROP POLICY IF EXISTS "Users can remove their appreciation" ON public.appreciations;

CREATE POLICY "Appreciations are viewable by everyone" ON public.appreciations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can appreciate" ON public.appreciations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their appreciation" ON public.appreciations FOR DELETE USING (auth.uid() = user_id);

-- 4.6 Comments RLS
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can comment" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = comments.project_id AND projects.user_id = auth.uid())
);

-- 4.7 Follows RLS
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
DROP POLICY IF EXISTS "Users can follow creators" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow creators" ON public.follows;

CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow creators" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow creators" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- 4.8 Favorites RLS
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Authenticated users can favorite projects" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove their favorites" ON public.favorites;

CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can favorite projects" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- 4.9 Notifications RLS
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- 5. Automation Triggers & Functions
-- ==============================================================================

-- 5.1 Trigger: Automatically create public profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    LOWER(COALESCE(NEW.raw_user_meta_data->>'username', 'creator_' || substr(NEW.id::text, 1, 8))),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Creative Member'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/shapes/svg?seed=' || NEW.id::text)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5.2 Trigger: Sync Appreciations Count on Projects Table
CREATE OR REPLACE FUNCTION public.sync_project_appreciations()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects SET appreciations_count = appreciations_count + 1 WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects SET appreciations_count = GREATEST(0, appreciations_count - 1) WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_appreciation_added ON public.appreciations;
CREATE TRIGGER on_appreciation_added
  AFTER INSERT ON public.appreciations
  FOR EACH ROW EXECUTE PROCEDURE public.sync_project_appreciations();

DROP TRIGGER IF EXISTS on_appreciation_removed ON public.appreciations;
CREATE TRIGGER on_appreciation_removed
  AFTER DELETE ON public.appreciations
  FOR EACH ROW EXECUTE PROCEDURE public.sync_project_appreciations();

-- 5.3 Trigger: Sync Followers / Following Counts on Profiles Table
CREATE OR REPLACE FUNCTION public.sync_profile_follows()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
    UPDATE public.profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_follow_added ON public.follows;
CREATE TRIGGER on_follow_added
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE PROCEDURE public.sync_profile_follows();

DROP TRIGGER IF EXISTS on_follow_removed ON public.follows;
CREATE TRIGGER on_follow_removed
  AFTER DELETE ON public.follows
  FOR EACH ROW EXECUTE PROCEDURE public.sync_profile_follows();

-- ==============================================================================
-- 6. Initial Taxonomy Seed (Categories)
-- ==============================================================================
INSERT INTO public.categories (id, name, slug, description, icon, display_order)
VALUES
  ('ui-ux', 'UI/UX & Product Design', 'ui-ux', 'Digital product experiences, SaaS platforms, design systems, and mobile interfaces.', 'Layout', 1),
  ('branding', 'Branding & Visual Identity', 'branding', 'Brand strategy, identity systems, typography, logomarks, and visual guidelines.', 'Layers', 2),
  ('3d-motion', '3D & Motion Graphics', '3d-motion', 'Three-dimensional artwork, CGI rendering, spatial reality, and motion design.', 'Box', 3),
  ('photography', 'Photography & Art Direction', 'photography', 'Editorial photography, architectural capture, portraits, and visual narratives.', 'Camera', 4),
  ('illustration', 'Illustration & Concept Art', 'illustration', 'Digital painting, character design, editorial illustration, and concept art.', 'PenTool', 5),
  ('architecture', 'Architecture & Spatial Design', 'architecture', 'Interior architecture, spatial installations, structural design, and environments.', 'Building', 6),
  ('ai-art', 'AI & Generative Art', 'ai-art', 'Generative adversarial designs, algorithmic art, prompt-crafted visual syntheses.', 'Cpu', 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- ==============================================================================
-- 7. Storage Buckets & Policies
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('projects', 'projects', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploaded images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploaded images" ON storage.objects;

CREATE POLICY "Public can view project images" ON storage.objects
  FOR SELECT USING (bucket_id IN ('projects', 'avatars'));

CREATE POLICY "Authenticated users can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('projects', 'avatars')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own uploaded images" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('projects', 'avatars')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete own uploaded images" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('projects', 'avatars')
    AND auth.role() = 'authenticated'
  );
