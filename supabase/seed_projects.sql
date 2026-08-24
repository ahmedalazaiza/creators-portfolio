-- ==============================================================================
-- Portfolios - Seed Script: Categories & Showcase Projects
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon, display_order)
VALUES
  ('ui-ux', 'UI/UX & Product Design', 'ui-ux', 'SaaS dashboards, mobile interfaces, design systems, and user experiences', 'Layout', 1),
  ('3d-motion', '3D & Motion Graphics', '3d-motion', 'CGI rendering, 3D character design, motion choreography, and visual effects', 'Box', 2),
  ('branding', 'Branding & Visual Identity', 'branding', 'Brand identities, typography systems, logos, packaging, and art direction', 'Layers', 3),
  ('photography', 'Photography', 'photography', 'Architectural, editorial, landscape, portrait, and street photography', 'Camera', 4),
  ('illustration', 'Illustration & Concept', 'illustration', 'Digital painting, vector art, editorial illustrations, and concept worlds', 'PenTool', 5),
  ('architecture', 'Architecture & Spatial', 'architecture', 'Interior design, brutalist forms, futuristic pavilions, and physical spaces', 'Building', 6),
  ('ai-art', 'AI & Generative Art', 'ai-art', 'Algorithmic synthesis, creative computation, and post-digital aesthetics', 'Cpu', 7)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;
