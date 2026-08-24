import { Category } from "../types";

export const CATEGORIES: Category[] = [
  {
    id: "all",
    name: "All Creative Fields",
    slug: "all",
    description: "Discover curated masterworks across all creative disciplines",
    icon: "Sparkles",
    projectCount: 48,
    subCategories: [
      { id: "all-featured", name: "Featured Picks", slug: "featured", description: "Hand-curated editor choices" },
      { id: "all-trending", name: "Trending Today", slug: "trending", description: "Most loved works in the last 24h" },
      { id: "all-latest", name: "Recent Uploads", slug: "latest", description: "Freshly uploaded case studies" },
    ],
  },
  {
    id: "ui-ux",
    name: "UI/UX & Product Design",
    slug: "ui-ux",
    description: "SaaS dashboards, mobile interfaces, design systems, and user experiences",
    icon: "Layout",
    projectCount: 16,
    subCategories: [
      { id: "web-design", name: "Web & SaaS Design", slug: "web-design", description: "Responsive web apps and digital experiences" },
      { id: "mobile-apps", name: "Mobile UI (iOS / Android)", slug: "mobile-apps", description: "Clean app interfaces and user flows" },
      { id: "design-systems", name: "Design Systems", slug: "design-systems", description: "Component libraries, typography tokens & guides" },
      { id: "wireframing", name: "Wireframes & Prototypes", slug: "wireframing", description: "Interactive user journeys and UX architecture" },
      { id: "dashboards", name: "Analytics & Dashboards", slug: "dashboards", description: "Complex data visualization & CRM interfaces" },
    ],
  },
  {
    id: "branding",
    name: "Branding & Visual Identity",
    slug: "branding",
    description: "Brand identities, typography systems, logos, packaging, and art direction",
    icon: "Layers",
    projectCount: 12,
    subCategories: [
      { id: "logo-design", name: "Logo & Brandmarks", slug: "logo-design", description: "Iconic symbols, wordmarks and emblems" },
      { id: "visual-identity", name: "Visual Identity Systems", slug: "visual-identity", description: "Comprehensive brand identity kits & palettes" },
      { id: "packaging", name: "Packaging & Print", slug: "packaging", description: "Product boxes, labels, mockups & stationery" },
      { id: "typography", name: "Typography & Lettering", slug: "typography", description: "Custom typefaces, font pairing and layout" },
      { id: "art-direction", name: "Art Direction & Guidelines", slug: "art-direction", description: "Brand stylebooks and photographic directions" },
    ],
  },
  {
    id: "3d-motion",
    name: "3D & Motion Graphics",
    slug: "3d-motion",
    description: "CGI rendering, 3D character design, motion choreography, and visual effects",
    icon: "Box",
    projectCount: 14,
    subCategories: [
      { id: "cgi-rendering", name: "3D CGI & Modeling", slug: "cgi-rendering", description: "High-poly renders, realistic lighting and textures" },
      { id: "motion-design", name: "Motion Choreography", slug: "motion-design", description: "Kinetic typography and dynamic visual loops" },
      { id: "character-3d", name: "Character 3D & Avatar", slug: "character-3d", description: "Sculpted digital beings and game assets" },
      { id: "vfx-simulation", name: "VFX & Liquid Simulations", slug: "vfx-simulation", description: "Cloth, fluid, particles and dynamics" },
      { id: "product-3d", name: "Product Visualization", slug: "product-3d", description: "Commercial hardware, luxury and tech showcases" },
    ],
  },
  {
    id: "photography",
    name: "Photography",
    slug: "photography",
    description: "Architectural, editorial, landscape, portrait, and street photography",
    icon: "Camera",
    projectCount: 9,
    subCategories: [
      { id: "portrait", name: "Portrait & Fashion", slug: "portrait", description: "Editorial fashion shoots and studio portraiture" },
      { id: "architecture-photo", name: "Architectural & Spaces", slug: "architecture-photo", description: "Brutalist structures, interiors and urban lines" },
      { id: "landscape", name: "Landscape & Aerial", slug: "landscape", description: "Drone photography, mountains and natural light" },
      { id: "street-photo", name: "Street & Documentary", slug: "street-photo", description: "Candid moments, city rhythm and human stories" },
      { id: "commercial-photo", name: "Product & Studio", slug: "commercial-photo", description: "Clean studio setups and commercial lookbooks" },
    ],
  },
  {
    id: "illustration",
    name: "Illustration & Concept",
    slug: "illustration",
    description: "Digital painting, vector art, editorial illustrations, and concept worlds",
    icon: "PenTool",
    projectCount: 11,
    subCategories: [
      { id: "digital-painting", name: "Digital Painting", slug: "digital-painting", description: "Atmospheric paintings, brushes and color studies" },
      { id: "vector-art", name: "Vector & Iconography", slug: "vector-art", description: "Geometric shapes, flat illustrations and icons" },
      { id: "concept-art", name: "Concept Worlds & Sci-Fi", slug: "concept-art", description: "Environment design, futuristic cities and matte" },
      { id: "editorial-ill", name: "Editorial & Book Art", slug: "editorial-ill", description: "Magazine covers, storytelling and print art" },
      { id: "character-concept", name: "Character Concept", slug: "character-concept", description: "Costume sketches, creature design and poses" },
    ],
  },
  {
    id: "architecture",
    name: "Architecture & Spatial",
    slug: "architecture",
    description: "Interior design, brutalist forms, futuristic pavilions, and physical spaces",
    icon: "Building",
    projectCount: 8,
    subCategories: [
      { id: "interior-design", name: "Interior & Living Spaces", slug: "interior-design", description: "Minimalist homes, lounges and material palettes" },
      { id: "arch-viz", name: "Architectural Visualization", slug: "arch-viz", description: "Photorealistic archviz and CAD rendering" },
      { id: "urban-spaces", name: "Urban & Landscape", slug: "urban-spaces", description: "Public parks, plazas and urban planning" },
      { id: "exhibition-pavilions", name: "Pavilions & Exhibitions", slug: "exhibition-pavilions", description: "Temporary art installations and museum booths" },
    ],
  },
  {
    id: "ai-art",
    name: "AI & Generative Art",
    slug: "ai-art",
    description: "Algorithmic synthesis, creative computation, and post-digital aesthetics",
    icon: "Cpu",
    projectCount: 10,
    subCategories: [
      { id: "midjourney-prompts", name: "Midjourney & Latent Space", slug: "midjourney-prompts", description: "Prompt engineering and hyper-detailed synthesis" },
      { id: "generative-code", name: "Creative Code & Shaders", slug: "generative-code", description: "GLSL shaders, p5.js algorithms and canvas math" },
      { id: "ai-video", name: "AI Video & Neural Motion", slug: "ai-video", description: "Runway, Sora, Kling motion workflows" },
      { id: "synthetic-photo", name: "Synthetic Photography", slug: "synthetic-photo", description: "Fictional fashion and hyper-real surrealism" },
    ],
  },
];

export const POPULAR_TOOLS = [
  "Figma",
  "Blender",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Cinema 4D",
  "Lightroom",
  "Unreal Engine",
  "Midjourney",
  "Spline",
  "Houdini",
  "Procreate",
];

export const TIMEFRAMES = [
  { label: "All Time", value: "all" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

export const SORT_OPTIONS = [
  { label: "Curated & Featured", value: "featured" },
  { label: "Most Appreciated", value: "appreciations" },
  { label: "Most Viewed", value: "views" },
  { label: "Most Recent", value: "newest" },
] as const;
