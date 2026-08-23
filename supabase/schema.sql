-- ==============================================================================
-- Azaiza Gallery - Complete Database Schema & Setup (Supabase PostgreSQL)
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (extends auth.users)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0
);

-- 4. Projects Table
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
  accent_color TEXT DEFAULT '#aaff38',
  year TEXT DEFAULT '2025',
  tools TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  appreciations_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Project Images Table (for structured multi-image gallery assets)
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Appreciations (Likes) Table
CREATE TABLE IF NOT EXISTS public.appreciations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, project_id)
);

-- 7. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Follows Table
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY(follower_id, following_id)
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appreciations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if rerun
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories Policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Projects Policies
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

-- Project Images Policies
DROP POLICY IF EXISTS "Project images viewable by all" ON public.project_images;
DROP POLICY IF EXISTS "Users can manage images of their projects" ON public.project_images;

CREATE POLICY "Project images viewable by all" ON public.project_images
  FOR SELECT USING (true);

CREATE POLICY "Users can manage images of their projects" ON public.project_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_images.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Appreciations Policies
DROP POLICY IF EXISTS "Appreciations are viewable by everyone" ON public.appreciations;
DROP POLICY IF EXISTS "Authenticated users can appreciate" ON public.appreciations;
DROP POLICY IF EXISTS "Users can remove their appreciation" ON public.appreciations;

CREATE POLICY "Appreciations are viewable by everyone" ON public.appreciations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can appreciate" ON public.appreciations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their appreciation" ON public.appreciations
  FOR DELETE USING (auth.uid() = user_id);

-- Comments Policies
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can comment" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Follows Policies
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
DROP POLICY IF EXISTS "Users can follow creators" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow creators" ON public.follows;

CREATE POLICY "Follows are viewable by everyone" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow creators" ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow creators" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);

-- ==============================================================================
-- Automation Triggers & Functions
-- ==============================================================================

-- Trigger: Increment/Decrement appreciation counters automatically
CREATE OR REPLACE FUNCTION public.handle_new_appreciation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects
  SET appreciations_count = appreciations_count + 1
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_deleted_appreciation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects
  SET appreciations_count = GREATEST(appreciations_count - 1, 0)
  WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_appreciation_added ON public.appreciations;
CREATE TRIGGER on_appreciation_added
  AFTER INSERT ON public.appreciations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_appreciation();

DROP TRIGGER IF EXISTS on_appreciation_removed ON public.appreciations;
CREATE TRIGGER on_appreciation_removed
  AFTER DELETE ON public.appreciations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_deleted_appreciation();

-- Trigger: Automatically create public profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Creative Member'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- Initial Categories Seed Data
-- ==============================================================================
INSERT INTO public.categories (id, name, slug, description, icon, display_order)
VALUES
  ('ui-ux', 'UI/UX Design', 'ui-ux', 'User interface, mobile applications, and web experience design', 'Layout', 1),
  ('branding', 'Branding & Identity', 'branding', 'Brand guidelines, visual identity, logos, and packaging', 'Sparkles', 2),
  ('photography', 'Photography', 'photography', 'Editorial, landscape, portrait, and architectural photography', 'Camera', 3),
  ('3d-motion', '3D & Motion', '3d-motion', 'CGI renders, 3D modeling, animation, and visual effects', 'Box', 4),
  ('illustration', 'Illustration', 'illustration', 'Digital art, vector graphics, and concept character art', 'PenTool', 5),
  ('typography', 'Typography', 'typography', 'Custom type design, lettering, and editorial layouts', 'Type', 6),
  ('architecture', 'Architecture & Spatial', 'architecture', 'Interior styling, spatial architecture, and urban aesthetics', 'Building', 7),
  ('ai-art', 'AI & Digital Art', 'ai-art', 'Generative art, algorithmic aesthetics, and synthetic media', 'Cpu', 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- ==============================================================================
-- Storage Buckets (For direct case study and avatar image uploads)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('project-images', 'project-images', true),
  ('projects', 'projects', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images" ON storage.objects
  FOR SELECT USING (bucket_id IN ('project-images', 'projects', 'avatars'));

DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('project-images', 'projects', 'avatars')
    AND auth.role() = 'authenticated'
  );
