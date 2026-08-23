import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Eye,
  Layers,
  Wrench,
  Tag,
  Palette,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { CATEGORIES, POPULAR_TOOLS } from "../data/categories";

export default function ProjectEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allProjects, saveProject } = useProjects();

  const isEdit = Boolean(id);
  const existingProject = isEdit ? allProjects.find((p) => p.id === id) : null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("UI/UX & Product Design");
  const [categoryId, setCategoryId] = useState("ui-ux");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [accentColor, setAccentColor] = useState("#aaff38");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80"
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [tools, setTools] = useState<string[]>(["Figma"]);
  const [toolInput, setToolInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Design", "UX"]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  // Load existing project for editing
  useEffect(() => {
    if (existingProject) {
      setTitle(existingProject.title);
      setSlug(existingProject.slug);
      setCategory(existingProject.category);
      setCategoryId(existingProject.categoryId || "ui-ux");
      setYear(existingProject.year || "2025");
      setAccentColor(existingProject.accentColor || "#aaff38");
      setDescription(existingProject.description);
      setFullDescription(existingProject.fullDescription || existingProject.description);
      setCoverImage(existingProject.coverImage);
      setGalleryImages(existingProject.images || []);
      setTools(existingProject.tools || []);
      setTags(existingProject.tags || []);
      setStatus(existingProject.status === "draft" ? "draft" : "published");
    }
  }, [existingProject]);

  // Auto slug generation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catSlug = e.target.value;
    const found = CATEGORIES.find((c) => c.slug === catSlug);
    if (found) {
      setCategoryId(found.slug);
      setCategory(found.name);
    }
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setGalleryImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTool = (toolName: string) => {
    if (toolName.trim() && !tools.includes(toolName.trim())) {
      setTools((prev) => [...prev, toolName.trim()]);
      setToolInput("");
    }
  };

  const handleRemoveTool = (tool: string) => {
    setTools((prev) => prev.filter((t) => t !== tool));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImage.trim()) {
      alert("Please provide at least a project title and cover image URL.");
      return;
    }

    const savedId = saveProject(
      {
        id: isEdit ? id : undefined,
        title,
        slug: slug || `project-${Date.now()}`,
        category,
        categoryId,
        year,
        accentColor,
        description,
        fullDescription,
        coverImage,
        images: galleryImages,
        tools,
        tags,
        status,
      },
      user
    );

    navigate(`/project/${slug || savedId}`);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-16 sm:pt-20 pb-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft size={14} /> Back to Creator Studio
            </Link>
            <h1 className="text-3xl font-display font-extrabold text-foreground">
              {isEdit ? "Edit Case Study" : "Publish Masterwork"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStatus(status === "published" ? "draft" : "published")}
              className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                status === "published"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {status === "published" ? "● Status: Published" : "○ Status: Draft"}
            </button>
          </div>
        </div>

        {/* Project Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Details */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6">
            <h3 className="text-base font-bold font-display text-foreground border-b border-border pb-3">
              1. General Information
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Saudi National Portal — Enterprise Digital Experience"
                className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-sm font-semibold focus:outline-none focus:border-primary/60"
              />
            </div>

            {/* URL Slug & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  URL Slug
                </label>
                <div className="flex items-center rounded-2xl border border-border bg-input-background px-3">
                  <span className="text-xs font-mono text-muted-foreground">/project/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full py-3 px-1 bg-transparent text-foreground text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs font-mono focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            {/* Category & Accent Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Creative Field
                </label>
                <select
                  value={categoryId}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs font-medium focus:outline-none focus:border-primary/60"
                >
                  {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-11 rounded-xl border border-border bg-input-background cursor-pointer p-1"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs font-mono focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>
            </div>

            {/* Short Summary Description */}
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                Short Teaser Description (Card view) *
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A concise 1-2 sentence hook highlighting the scope and impact."
                className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60 resize-none"
              />
            </div>

            {/* Full Case Study Narrative */}
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                Detailed Case Study Narrative (Markdown supported)
              </label>
              <textarea
                rows={6}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Explain the client background, design challenges, typography systems, iterative milestones, and measurable outcomes..."
                className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          {/* Visual Assets & Images */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6">
            <h3 className="text-base font-bold font-display text-foreground border-b border-border pb-3">
              2. Visual Presentation & Gallery
            </h3>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                Cover Image URL *
              </label>
              <input
                type="url"
                required
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
              />

              {/* Cover Preview */}
              {coverImage && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-border bg-muted/20 h-48 sm:h-64 relative">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-mono">
                    Cover Preview
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Images Strip */}
            <div className="space-y-4 pt-4 border-t border-border">
              <label className="block text-xs font-mono uppercase text-muted-foreground">
                Multi-Image Case Study Gallery ({galleryImages.length})
              </label>

              {/* Add image form */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL (Unsplash or hosted link)..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/60 text-foreground font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Image
                </button>
              </div>

              {/* Gallery Image Previews */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border border-border group aspect-[3/2] bg-muted/20"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/80 text-white hover:text-destructive flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Software & Tags */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6">
            <h3 className="text-base font-bold font-display text-foreground border-b border-border pb-3">
              3. Tools & Search Tags
            </h3>

            {/* Tools */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase text-muted-foreground">
                Software & Tools Used
              </label>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {POPULAR_TOOLS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleAddTool(t)}
                    className="px-2.5 py-1 rounded-lg border border-border/80 bg-muted/20 hover:bg-primary/10 hover:border-primary/40 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + {t}
                  </button>
                ))}
              </div>

              {/* Selected Tools */}
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl border border-border bg-input-background min-h-12 items-center">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card border border-border text-foreground text-xs font-medium"
                  >
                    {tool}
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(tool)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTool(toolInput);
                    }
                  }}
                  placeholder="Type custom tool & hit enter..."
                  className="flex-1 bg-transparent px-2 py-1 text-xs text-foreground focus:outline-none min-w-36"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="block text-xs font-mono uppercase text-muted-foreground">
                Search Tags & Keywords (hit Enter to add)
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl border border-border bg-input-background min-h-12 items-center">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags..."
                  className="flex-1 bg-transparent px-2 py-1 text-xs text-foreground focus:outline-none min-w-28"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-full border border-border bg-card text-foreground font-semibold text-xs hover:bg-muted transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-[0_0_25px_rgba(170,255,56,0.35)] hover:opacity-90 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check size={16} />
              <span>{isEdit ? "Save Changes" : "Publish Masterwork"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.main>
  );
}
