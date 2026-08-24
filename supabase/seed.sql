-- ==============================================================================
-- Portfolios - Comprehensive High-Quality Seed Data & Auto-Migration
-- (Run this directly in Supabase SQL Editor - Safe & Self-Healing)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Auto-Migrate: Ensure all columns exist on profiles table if it was created earlier
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banner_url TEXT DEFAULT 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS available_for_work BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS followers_count INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS following_count INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_appreciations INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_views INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Auto-Migrate: Ensure categories table exists & is populated
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0
);

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

-- 4. Auto-Migrate: Ensure projects table & all columns exist
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'UI/UX & Product Design';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#CDF22B';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '2025';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tools TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS appreciations_count INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 5. Auto-Migrate: Ensure auxiliary tables exist
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.appreciations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, project_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY(follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, project_id)
);

-- ==============================================================================
-- 6. Insert Auth Users (Satisfies Foreign Keys to auth.users)
-- ==============================================================================
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES
  ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'karim@portfolios.design', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcdefghijkl', now(), '{"provider":"email","providers":["email"]}', '{"username":"karim_design","full_name":"Karim El-Sayed"}', now(), now()),
  ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'elena@portfolios.design', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcdefghijkl', now(), '{"provider":"email","providers":["email"]}', '{"username":"elena_3d","full_name":"Elena Rostova"}', now(), now()),
  ('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maya@portfolios.design', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcdefghijkl', now(), '{"provider":"email","providers":["email"]}', '{"username":"maya_brand","full_name":"Maya Chen"}', now(), now()),
  ('a4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marcus@portfolios.design', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcdefghijkl', now(), '{"provider":"email","providers":["email"]}', '{"username":"marcus_arch","full_name":"Marcus Vance"}', now(), now()),
  ('a5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sofia@portfolios.design', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcdefghijkl', now(), '{"provider":"email","providers":["email"]}', '{"username":"sofia_creative","full_name":"Sofia Al-Mansoor"}', now(), now()),
  ('a6666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'david@portfolios.design', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcdefghijkl', now(), '{"provider":"email","providers":["email"]}', '{"username":"david_spatial","full_name":"David Lindqvist"}', now(), now()),
  ('a7777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'zaid@portfolios.design', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcdefghijkl', now(), '{"provider":"email","providers":["email"]}', '{"username":"zaid_motion","full_name":"Zaid Al-Khatib"}', now(), now()),
  ('a8888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'chloe@portfolios.design', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcdefghijkl', now(), '{"provider":"email","providers":["email"]}', '{"username":"chloe_art","full_name":"Chloe Dubois"}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 7. Insert/Update Real Creator Profiles
-- ==============================================================================
INSERT INTO public.profiles (
  id,
  username,
  full_name,
  headline,
  bio,
  avatar_url,
  banner_url,
  location,
  website,
  available_for_work,
  skills,
  social_links,
  followers_count,
  following_count,
  total_appreciations,
  total_views,
  is_email_verified
) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'karim_design',
    'Karim El-Sayed',
    'Principal Product Designer & Design Systems Lead',
    'Crafting high-precision SaaS platforms, multi-brand design tokens, and fluid spatial interfaces. Former design director with 10+ years shaping digital products.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    'Dubai, UAE',
    'https://karimdesign.studio',
    true,
    ARRAY['Design Systems', 'UI/UX', 'Figma Tokens', 'SaaS Architecture', 'Prototyping'],
    '{"twitter":"https://twitter.com/karim_dsgn","linkedin":"https://linkedin.com/in/karim","dribbble":"https://dribbble.com/karim"}'::jsonb,
    1420,
    318,
    3840,
    19200,
    true
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'elena_3d',
    'Elena Rostova',
    '3D CGI Artist & Cinema 4D Visualizer',
    'Exploring futuristic industrial design, Octane light transport, and cinematic sci-fi environments for global brands and tech pioneers.',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80',
    'Berlin, Germany',
    'https://rostova3d.art',
    true,
    ARRAY['Cinema 4D', 'Octane Render', '3D Motion', 'Lighting & Texturing', 'Houdini'],
    '{"instagram":"https://instagram.com/elena_3d","artstation":"https://artstation.com/elena_3d"}'::jsonb,
    2150,
    410,
    5920,
    28400,
    true
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'maya_brand',
    'Maya Chen',
    'Brand Identity Strategist & Typographer',
    'Creating memorable brand identities, custom kinetic typography, and comprehensive packaging systems with cultural resonance.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'Singapore',
    'https://mayachen.design',
    false,
    ARRAY['Brand Strategy', 'Typography', 'Packaging Design', 'Identity Systems', 'Editorial'],
    '{"behance":"https://behance.net/mayachen","instagram":"https://instagram.com/mayachen"}'::jsonb,
    980,
    215,
    2450,
    14300,
    true
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'marcus_arch',
    'Marcus Vance',
    'Architectural Photographer & Spatial Designer',
    'Documenting brutalist concrete structures, minimal interior architecture, and sustainable spatial installations across Europe and Asia.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    'Stockholm, Sweden',
    'https://marcusvance.photo',
    true,
    ARRAY['Architectural Photography', 'Spatial Design', 'Editorial', 'Light Studies', 'Color Grading'],
    '{"instagram":"https://instagram.com/marcus_arch","website":"https://marcusvance.photo"}'::jsonb,
    1670,
    180,
    4100,
    21500,
    true
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'sofia_creative',
    'Sofia Al-Mansoor',
    'Senior Illustrator & Visual Concept Artist',
    'Blending organic textures with futuristic surrealism. Specializing in editorial illustration, key visual art, and character design.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    'Riyadh, Saudi Arabia',
    'https://sofia-art.com',
    true,
    ARRAY['Digital Illustration', 'Concept Art', 'Procreate', 'Adobe Illustrator', 'Art Direction'],
    '{"twitter":"https://twitter.com/sofia_art","instagram":"https://instagram.com/sofia_art"}'::jsonb,
    1890,
    340,
    4680,
    23900,
    true
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    'david_spatial',
    'David Lindqvist',
    'Spatial UI & Mixed Reality Architect',
    'Designing next-generation spatial computing interfaces, visionOS experiences, and 3D gesture interaction paradigms.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    'Copenhagen, Denmark',
    'https://davidlindqvist.tech',
    true,
    ARRAY['Spatial UI', 'visionOS', 'Figma', 'Spline 3D', 'Unity UI'],
    '{"linkedin":"https://linkedin.com/in/davidlindqvist","github":"https://github.com/david"}'::jsonb,
    1120,
    195,
    3120,
    16800,
    true
  ),
  (
    'a7777777-7777-7777-7777-777777777777',
    'zaid_motion',
    'Zaid Al-Khatib',
    'Motion Director & Kinetic Brand Designer',
    'Directing high-energy product launch teasers, 3D motion systems, and kinetic UI micro-interactions for modern tech unicorns.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
    'Amman, Jordan',
    'https://zaidmotion.tv',
    true,
    ARRAY['After Effects', 'Cinema 4D', 'Motion Design', 'Lottie', 'Brand Motion'],
    '{"vimeo":"https://vimeo.com/zaidmotion","instagram":"https://instagram.com/zaidmotion"}'::jsonb,
    1560,
    280,
    3750,
    18400,
    true
  ),
  (
    'a8888888-8888-8888-8888-888888888888',
    'chloe_art',
    'Chloe Dubois',
    'Generative AI Artist & Creative Technologist',
    'Synthesizing algorithmic prompt engineering with digital craftsmanship to produce immersive digital art installations and brand visuals.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    'Paris, France',
    'https://chloedubois.art',
    true,
    ARRAY['Generative AI', 'Midjourney Pro', 'TouchDesigner', 'Digital Art', 'Creative Coding'],
    '{"twitter":"https://twitter.com/chloe_genart","instagram":"https://instagram.com/chloe_genart"}'::jsonb,
    2300,
    490,
    6200,
    31000,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  banner_url = EXCLUDED.banner_url,
  location = EXCLUDED.location,
  website = EXCLUDED.website,
  available_for_work = EXCLUDED.available_for_work,
  skills = EXCLUDED.skills,
  social_links = EXCLUDED.social_links;

-- ==============================================================================
-- 8. Insert 16 Curated Case Studies Across All Categories
-- ==============================================================================
INSERT INTO public.projects (
  id,
  user_id,
  title,
  slug,
  description,
  full_description,
  category_id,
  category,
  cover_image,
  accent_color,
  year,
  tools,
  tags,
  images,
  status,
  is_featured,
  views_count,
  appreciations_count,
  created_at
) VALUES
  -- 1. UI/UX: Lumina
  (
    'b1010101-1010-1010-1010-101010101010',
    'a1111111-1111-1111-1111-111111111111',
    'Lumina — Spatial Reality OS Interface',
    'lumina-spatial-ui',
    'A comprehensive design system for next-generation spatial computing, featuring glassmorphic depth hierarchies, tactile micro-interactions, and responsive layout tokens.',
    'Lumina is an enterprise-grade spatial OS interface engineered for high-precision multitasking in mixed reality environments. Developed from the ground up to solve ergonomic eye fatigue and intuitive spatial depth ordering.',
    'ui-ux',
    'UI/UX & Product Design',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2025',
    ARRAY['Figma', 'Protopie', 'Spline', 'React', 'Tailwind CSS'],
    ARRAY['Design System', 'Spatial UI', 'visionOS', 'Glassmorphism', 'Product Design'],
    ARRAY[
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    true,
    4280,
    385,
    now() - interval '2 days'
  ),

  -- 2. 3D: Hyperion 3D
  (
    'b2020202-2020-2020-2020-202020202020',
    'a2222222-2222-2222-2222-222222222222',
    'Hyperion — Autonomous Vehicle CGI Concept',
    'hyperion-3d-concept',
    'Photorealistic 3D automotive visualization highlighting aerodynamic curvature, bespoke carbon fiber shaders, and futuristic studio lighting setup.',
    'A concept design study exploring sustainable luxury transport for the year 2035. Modeled in Cinema 4D and rendered in Octane Render with custom refractive glass materials.',
    '3d-motion',
    '3D & Motion Graphics',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    '#1E45FB',
    '2025',
    ARRAY['Cinema 4D', 'Octane Render', 'Substance Painter', 'Photoshop'],
    ARRAY['3D Automotive', 'CGI', 'Octane Render', 'Industrial Design', 'Concept Art'],
    ARRAY[
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    true,
    5120,
    490,
    now() - interval '3 days'
  ),

  -- 3. Branding: Monolith
  (
    'b3030303-3030-3030-3030-303030303030',
    'a3333333-3333-3333-3333-333333333333',
    'Monolith — Architectural Spatial Brand Identity',
    'monolith-brand-identity',
    'Complete visual identity system for a contemporary architecture studio, focusing on bold typographic grids, tactile embossed stationery, and brutalist aesthetics.',
    'Created a distinct brand language built upon custom monospace typography and debossed raw paper stocks. The design reflects structural permanence and modern minimalism.',
    'branding',
    'Branding & Visual Identity',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2025',
    ARRAY['Illustrator', 'InDesign', 'Photoshop', 'Figma'],
    ARRAY['Brand Identity', 'Typography', 'Stationery', 'Editorial', 'Minimalism'],
    ARRAY[
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    false,
    2890,
    240,
    now() - interval '4 days'
  ),

  -- 4. Photography: Vesper
  (
    'b4040404-4040-4040-4040-404040404040',
    'a4444444-4444-4444-4444-444444444444',
    'Vesper — Scandinavian Minimalist Architecture',
    'vesper-architecture-photography',
    'A high-contrast monochrome and earthy tones photography series capturing geometric shadows and monolithic concrete across modern Copenhagen.',
    'Shot over three months during the Nordic winter solstice, this visual essay captures the fleeting interaction between sharp angular structures and low-angled natural sunlight.',
    'photography',
    'Photography & Art Direction',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2024',
    ARRAY['Leica M11', 'Capture One', 'Lightroom Pro'],
    ARRAY['Architecture', 'Photography', 'Nordic Design', 'Monochrome', 'Shadows'],
    ARRAY[
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    true,
    3420,
    315,
    now() - interval '5 days'
  ),

  -- 5. Illustration: Solstice
  (
    'b5050505-5050-5050-5050-505050505050',
    'a5555555-5555-5555-5555-555555555555',
    'Solstice — Sci-Fi Editorial Concept Illustrations',
    'solstice-concept-illustration',
    'Digital concept art narrative depicting ancient cosmic temples and astronaut wanderers across alien mineral dunes.',
    'Commissioned for a feature editorial story on future planetary settlements. Crafted with custom digital brushwork and cinematic atmospheric grading.',
    'illustration',
    'Illustration & Concept Art',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    '#1E45FB',
    '2025',
    ARRAY['Procreate', 'Photoshop', 'Wacom Cintiq'],
    ARRAY['Concept Art', 'Digital Painting', 'Sci-Fi', 'Editorial', 'Character Design'],
    ARRAY[
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    false,
    2150,
    195,
    now() - interval '6 days'
  ),

  -- 6. AI Art: Aura
  (
    'b6060606-6060-6060-6060-606060606060',
    'a8888888-8888-8888-8888-888888888888',
    'Aura — Neural Ambient Art Installation',
    'aura-neural-art',
    'An interactive generative series combining synthetic neural textures with audio-reactive procedural light simulations.',
    'Aura investigates the intersection of human emotional memory and artificial pattern generation. Rendered through generative diffusion pipelines refined with custom code.',
    'ai-art',
    'AI & Generative Art',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2025',
    ARRAY['Midjourney', 'TouchDesigner', 'Python', 'After Effects'],
    ARRAY['Generative AI', 'Neural Art', 'Creative Coding', 'Installation', 'Ambient'],
    ARRAY[
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    true,
    4950,
    460,
    now() - interval '7 days'
  ),

  -- 7. UI/UX: Nexus AI
  (
    'b7070707-7070-7070-7070-707070707070',
    'a1111111-1111-1111-1111-111111111111',
    'Nexus AI — Enterprise Autonomous Cloud Platform',
    'nexus-ai-cloud-platform',
    'Complex data density made effortless. A dark-mode first enterprise management dashboard with predictive analytics and customizable node-graph workflows.',
    'Designed for machine learning engineers to monitor high-throughput LLM clusters in real time with zero latency UI updates.',
    'ui-ux',
    'UI/UX & Product Design',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2025',
    ARRAY['Figma', 'React', 'Tailwind CSS', 'D3.js'],
    ARRAY['SaaS', 'Dashboard', 'Data Visualization', 'Enterprise UI', 'Design System'],
    ARRAY[
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    false,
    3150,
    270,
    now() - interval '8 days'
  ),

  -- 8. 3D: Cyberpunk Metropolis
  (
    'b8080808-8080-8080-8080-808080808080',
    'a2222222-2222-2222-2222-222222222222',
    'Neo Tokyo 2099 — Cinematic 3D Environment',
    'neo-tokyo-3d-scene',
    'Vast volumetric cityscape showcasing rain-soaked asphalt reflections, neon holographic typography, and dense architectural layering.',
    'Constructed in Houdini and Cinema 4D utilizing procedural building generation assets and ACES color workflow for film-grade fidelity.',
    '3d-motion',
    '3D & Motion Graphics',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    '#1E45FB',
    '2025',
    ARRAY['Cinema 4D', 'Octane Render', 'Houdini', 'Nuke'],
    ARRAY['3D Environment', 'Cyberpunk', 'Cinematic', 'Lighting', 'Volumetrics'],
    ARRAY[
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    true,
    6400,
    580,
    now() - interval '9 days'
  ),

  -- 9. Branding: Zenith Coffee
  (
    'b9090909-9090-9090-9090-909090909090',
    'a3333333-3333-3333-3333-333333333333',
    'Zenith Specialty Roasters — Brand & Packaging',
    'zenith-coffee-branding',
    'Minimalist sustainable packaging, custom foil-stamped labels, and an organic warm color palette for an artisan micro-roastery.',
    'Developed a complete packaging hierarchy that clearly communicates single-origin coffee flavor notes and roast altitudes through elegant iconography.',
    'branding',
    'Branding & Visual Identity',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2024',
    ARRAY['Illustrator', 'Photoshop', 'Dimension'],
    ARRAY['Packaging', 'Brand Identity', 'Coffee', 'Typography', 'Sustainable'],
    ARRAY[
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    false,
    1950,
    180,
    now() - interval '10 days'
  ),

  -- 10. Architecture: Concrete Pavilions
  (
    'ba0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a',
    'a4444444-4444-4444-4444-444444444444',
    'Brutalist Pavilions — Spatial Form & Shadow',
    'brutalist-pavilions-spatial',
    'A photographic exploration of raw board-marked concrete facades, open skylights, and dramatic negative space in modern museum structures.',
    'Captured across three international modern art museums, focusing on the structural rhythm of load-bearing cantilever beams.',
    'architecture',
    'Architecture & Spatial Design',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2025',
    ARRAY['Sony A7R V', 'Capture One', 'Lightroom'],
    ARRAY['Brutalism', 'Concrete Architecture', 'Spatial Form', 'Museum Design'],
    ARRAY[
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    true,
    3800,
    340,
    now() - interval '11 days'
  ),

  -- 11. 3D: Chronos Timepiece
  (
    'bb0b0b0b-0b0b-0b0b-0b0b-0b0b0b0b0b0b',
    'a2222222-2222-2222-2222-222222222222',
    'Chronos X — Luxury Horology 3D Rendering',
    'chronos-horology-3d',
    'Macro product rendering of an automatic skeleton chronograph featuring brushed titanium, sapphire crystal reflections, and exposed gear mechanics.',
    'Precision engineered 3D CAD modeling with micron-level chamfer details and complex anisotropic brushed metallic shaders.',
    '3d-motion',
    '3D & Motion Graphics',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2025',
    ARRAY['Cinema 4D', 'Octane Render', 'ZBrush', 'Photoshop'],
    ARRAY['Horology', '3D Product', 'Watch Design', 'Macro CGI', 'Luxury'],
    ARRAY[
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    false,
    2750,
    260,
    now() - interval '12 days'
  ),

  -- 12. Motion: Kinetix Brand Teaser
  (
    'bc0c0c0c-0c0c-0c0c-0c0c-0c0c0c0c0c0c',
    'a7777777-7777-7777-7777-777777777777',
    'Kinetix — Dynamic Motion Identity & Kinetic Type',
    'kinetix-motion-identity',
    'High-tempo kinetic typography identity system with seamless morphing transitions, variable font axes, and reactive audio beats.',
    'Designed for an international electronic music festival, this motion toolkit allows real-time generation of custom posters and stage visuals.',
    '3d-motion',
    '3D & Motion Graphics',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    '#1E45FB',
    '2025',
    ARRAY['After Effects', 'Cinema 4D', 'Illustrator', 'Cavalry'],
    ARRAY['Motion Graphics', 'Kinetic Typography', 'Brand Motion', 'Stage Visuals'],
    ARRAY[
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    true,
    4300,
    390,
    now() - interval '13 days'
  ),

  -- 13. UI/UX: Nomad Mobile
  (
    'bd0d0d0d-0d0d-0d0d-0d0d-0d0d0d0d0d0d',
    'a6666666-6666-6666-6666-666666666666',
    'Nomad — Intelligent Travel & Itinerary Experience',
    'nomad-travel-app',
    'A fluid mobile app interface with offline map caches, seamless collaborative booking cards, and contextual AI itinerary assistance.',
    'Re-imagining the travel booking journey through gesture-first navigation and micro-haptic feedback loops.',
    'ui-ux',
    'UI/UX & Product Design',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2024',
    ARRAY['Figma', 'Protopie', 'SwiftUI', 'Tailwind CSS'],
    ARRAY['Mobile App', 'Travel UI', 'iOS Design', 'Micro-interactions', 'Prototyping'],
    ARRAY[
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    false,
    3100,
    280,
    now() - interval '14 days'
  ),

  -- 14. Illustration: Mirage
  (
    'be0e0e0e-0e0e-0e0e-0e0e-0e0e0e0e0e0e',
    'a5555555-5555-5555-5555-555555555555',
    'Mirage — Haute Couture Digital Fashion Illustrations',
    'mirage-fashion-illustration',
    'Surreal digital fashion portraits exploring flowing liquid silks, metallic headpieces, and vivid expressive brushwork.',
    'Featured on the cover of contemporary digital art magazines and showcased in virtual runway installations.',
    'illustration',
    'Illustration & Concept Art',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2025',
    ARRAY['Photoshop', 'Procreate', 'Painter'],
    ARRAY['Fashion Illustration', 'Digital Art', 'Editorial Portrait', 'Textures'],
    ARRAY[
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    true,
    3650,
    335,
    now() - interval '15 days'
  ),

  -- 15. AI Art: Synapse
  (
    'bf0f0f0f-0f0f-0f0f-0f0f-0f0f0f0f0f0f',
    'a8888888-8888-8888-8888-888888888888',
    'Synapse — Bio-Computational Abstract Sculptures',
    'synapse-bio-computational-art',
    'Algorithmic visual explorations mimicking organic fungal networks, iridescent coral formations, and microscopic crystalline growth.',
    'Created by blending generative AI models with 3D procedural displacement mapping to produce ultra-high resolution wall art prints.',
    'ai-art',
    'AI & Generative Art',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2025',
    ARRAY['Midjourney', 'Blender', 'TouchDesigner', 'Photoshop'],
    ARRAY['Generative AI', 'Abstract Art', 'Organic Shapes', 'Iridescent', '3D Wall Art'],
    ARRAY[
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    false,
    2890,
    255,
    now() - interval '16 days'
  ),

  -- 16. Architecture: Desert Sanctuary
  (
    'b1111111-2222-3333-4444-555555555555',
    'a4444444-4444-4444-4444-444444444444',
    'The Desert Sanctuary — Earth & Rammed Concrete',
    'desert-sanctuary-architecture',
    'Passive solar architectural pavilion embedded in arid desert terrain, utilizing rammed earth walls and shaded thermal courtyards.',
    'Documented during twilight hours to emphasize the warm earthy textures and seamless connection to the natural topography.',
    'architecture',
    'Architecture & Spatial Design',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    '#CDF22B',
    '2024',
    ARRAY['Hasselblad X2D', 'Phocus', 'Photoshop'],
    ARRAY['Desert Architecture', 'Rammed Earth', 'Sustainable', 'Spatial Photography'],
    ARRAY[
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'
    ],
    'published',
    false,
    2400,
    210,
    now() - interval '17 days'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  full_description = EXCLUDED.full_description,
  category_id = EXCLUDED.category_id,
  category = EXCLUDED.category,
  cover_image = EXCLUDED.cover_image,
  accent_color = EXCLUDED.accent_color,
  year = EXCLUDED.year,
  tools = EXCLUDED.tools,
  tags = EXCLUDED.tags,
  images = EXCLUDED.images,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured;

-- ==============================================================================
-- 9. Insert Project Images (Detailed Multi-Media Galleries)
-- ==============================================================================
INSERT INTO public.project_images (id, project_id, image_url, caption, display_order)
VALUES
  ('c1010101-1010-1010-1010-101010101010', 'b1010101-1010-1010-1010-101010101010', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80', 'Spatial OS Desktop Workspace Hierarchy', 1),
  ('c1010101-1010-1010-1010-101010101011', 'b1010101-1010-1010-1010-101010101010', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80', 'Glassmorphism Depth Tokens & Refraction States', 2),
  ('c1010101-1010-1010-1010-101010101012', 'b1010101-1010-1010-1010-101010101010', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80', 'Adaptive Fluid Navigation Controls', 3),

  ('c2020202-2020-2020-2020-202020202020', 'b2020202-2020-2020-2020-202020202020', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=80', 'Hyperion Aerodynamic Side Profile View', 1),
  ('c2020202-2020-2020-2020-202020202021', 'b2020202-2020-2020-2020-202020202020', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80', 'Bespoke Carbon Weave Shading Closeup', 2),

  ('c3030303-3030-3030-3030-303030303030', 'b3030303-3030-3030-3030-303030303030', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', 'Monolith Blind-Embossed Stationery System', 1),
  ('c3030303-3030-3030-3030-303030303031', 'b3030303-3030-3030-3030-303030303030', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80', 'Custom Monospace Typography Guide', 2)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 10. Insert Appreciations (Likes)
-- ==============================================================================
INSERT INTO public.appreciations (id, user_id, project_id, created_at)
VALUES
  ('d1010101-1010-1010-1010-101010101010', 'a2222222-2222-2222-2222-222222222222', 'b1010101-1010-1010-1010-101010101010', now() - interval '1 day'),
  ('d1010101-1010-1010-1010-101010101011', 'a3333333-3333-3333-3333-333333333333', 'b1010101-1010-1010-1010-101010101010', now() - interval '18 hours'),
  ('d1010101-1010-1010-1010-101010101012', 'a4444444-4444-4444-4444-444444444444', 'b1010101-1010-1010-1010-101010101010', now() - interval '12 hours'),
  ('d2020202-2020-2020-2020-202020202020', 'a1111111-1111-1111-1111-111111111111', 'b2020202-2020-2020-2020-202020202020', now() - interval '2 days'),
  ('d2020202-2020-2020-2020-202020202021', 'a5555555-5555-5555-5555-555555555555', 'b2020202-2020-2020-2020-202020202020', now() - interval '1 day'),
  ('d3030303-3030-3030-3030-303030303030', 'a1111111-1111-1111-1111-111111111111', 'b3030303-3030-3030-3030-303030303030', now() - interval '3 days'),
  ('d4040404-4040-4040-4040-404040404040', 'a2222222-2222-2222-2222-222222222222', 'b4040404-4040-4040-4040-404040404040', now() - interval '4 days'),
  ('d6060606-6060-6060-6060-606060606060', 'a3333333-3333-3333-3333-333333333333', 'b6060606-6060-6060-6060-606060606060', now() - interval '2 days')
ON CONFLICT (user_id, project_id) DO NOTHING;

-- ==============================================================================
-- 11. Insert Creator Comments
-- ==============================================================================
INSERT INTO public.comments (id, project_id, user_id, content, created_at)
VALUES
  (
    'e1010101-1010-1010-1010-101010101010',
    'b1010101-1010-1010-1010-101010101010',
    'a2222222-2222-2222-2222-222222222222',
    'The glassmorphic lighting tokens and refraction logic here are pure perfection! Beautifully executed depth hierarchy.',
    now() - interval '1 day'
  ),
  (
    'e1010101-1010-1010-1010-101010101011',
    'b1010101-1010-1010-1010-101010101010',
    'a6666666-6666-6666-6666-666666666666',
    'Inspiring work on spatial ergonomic limits. How did you structure the z-axis depth sorting tokens for multiple open floating panels?',
    now() - interval '18 hours'
  ),
  (
    'e2020202-2020-2020-2020-202020202020',
    'b2020202-2020-2020-2020-202020202020',
    'a1111111-1111-1111-1111-111111111111',
    'That carbon fiber anisotropy and studio rim light is unreal, Elena! Inspiring render quality.',
    now() - interval '2 days'
  ),
  (
    'e3030303-3030-3030-3030-303030303030',
    'b3030303-3030-3030-3030-303030303030',
    'a4444444-4444-4444-4444-444444444444',
    'Love the tactile brutalist approach on the debossed paper stocks. Really matches the spatial architecture spirit.',
    now() - interval '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 12. Insert Follows (Social Connections)
-- ==============================================================================
INSERT INTO public.follows (follower_id, following_id, created_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', now() - interval '5 days'),
  ('a1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', now() - interval '4 days'),
  ('a2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', now() - interval '3 days'),
  ('a2222222-2222-2222-2222-222222222222', 'a7777777-7777-7777-7777-777777777777', now() - interval '3 days'),
  ('a3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', now() - interval '2 days'),
  ('a4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', now() - interval '2 days'),
  ('a5555555-5555-5555-5555-555555555555', 'a2222222-2222-2222-2222-222222222222', now() - interval '1 day')
ON CONFLICT (follower_id, following_id) DO NOTHING;
