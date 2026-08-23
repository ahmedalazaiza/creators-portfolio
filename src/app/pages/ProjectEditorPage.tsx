import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Upload,
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
  Calendar,
  AlertCircle,
  FileText,
  Loader2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES, POPULAR_TOOLS } from "../data/categories";
import { uploadImageToSupabase } from "../../lib/supabase";

const COLOR_PRESETS = [
  "#0057ff", // Royal Blue
  "#2563eb", // Electric Blue
  "#0284c7", // Sky Blue
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#10b981", // Emerald
  "#e11d48", // Rose
];

export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allProjects, saveProject, deleteProject } = useProjects();

  const isEditing = Boolean(id);
  const existingProject = id ? allProjects.find((p) => p.id === id || p.slug === id) : null;

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("ui-ux");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [accentColor, setAccentColor] = useState("#0057ff");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>(["Figma"]);
  const [toolInput, setToolInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Design", "UI/UX"]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  // UI State
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Load existing project if in edit mode
  useEffect(() => {
    if (existingProject) {
      setTitle(existingProject.title || "");
      setSlug(existingProject.slug || "");
      setCategoryId(existingProject.categoryId || "ui-ux");
      setYear(existingProject.year || "2025");
      setAccentColor(existingProject.accentColor || "#CDF22B");
      setDescription(existingProject.description || "");
      setFullDescription(existingProject.fullDescription || "");
      setCoverImage(existingProject.coverImage || "");
      setGalleryImages(existingProject.images || []);
      setTools(existingProject.tools || ["Figma"]);
      setTags(existingProject.tags || ["Design"]);
      setStatus(existingProject.status === "draft" ? "draft" : "published");
    }
  }, [existingProject]);

  // Auto-generate slug when typing title (if creating new)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  // Upload Cover Image
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMessage("");
    try {
      const publicUrl = await uploadImageToSupabase(file, "project-images");
      setCoverImage(publicUrl);
    } catch (err: any) {
      setErrorMessage("Failed to upload cover image. Please try again.");
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload Gallery Images
  const handleGalleryFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setErrorMessage("");
    try {
      const uploadPromises = Array.from(files).map((f) =>
        uploadImageToSupabase(f, "project-images")
      );
      const urls = await Promise.all(uploadPromises);
      setGalleryImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      setErrorMessage("Failed to upload some gallery images.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Add Tool
  const handleAddTool = (toolToAdd?: string) => {
    const t = (toolToAdd || toolInput).trim();
    if (t && !tools.includes(t)) {
      setTools((prev) => [...prev, t]);
      setToolInput("");
    }
  };

  const removeTool = (toolToRemove: string) => {
    setTools((prev) => prev.filter((t) => t !== toolToRemove));
  };

  // Add Tag
  const handleAddTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Save / Publish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Please provide a project title.");
      return;
    }
    if (!coverImage.trim()) {
      setErrorMessage("Please upload or provide a cover image.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Please write a short description.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const categoryObj = CATEGORIES.find((c) => c.slug === categoryId);
    const categoryName = categoryObj ? categoryObj.name : "UI/UX Design";

    try {
      const savedProject = await saveProject(
        {
          id: existingProject?.id,
          title: title.trim(),
          slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          category: categoryName,
          categoryId,
          year,
          accentColor,
          description: description.trim(),
          fullDescription: fullDescription.trim(),
          coverImage,
          images: galleryImages,
          tools,
          tags,
          status,
        },
        user
      );

      navigate(`/project/${savedProject.slug || savedProject.id}`);
    } catch (err: any) {
      setErrorMessage("Failed to save project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (existingProject) {
      await deleteProject(existingProject.id);
      navigate("/dashboard");
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
            >
              <ArrowLeft size={13} />
              <span>Back to Studio Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
              {isEditing ? "Edit Case Study" : "Create Masterwork Case Study"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Publish high-res screens, define your creative process, and showcase your craftsmanship.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            {isEditing && (
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="px-3.5 py-2 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-[0_0_20px_rgba(205,242,43,0.3)] hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>{status === "published" ? "Publish Project" : "Save as Draft"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Basic Metadata Section */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <h2 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <span>Project Core Essentials</span>
            </h2>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                Project Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Lumina — Spatial Reality OS Interface"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs font-semibold placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Slug + Category + Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  Creative Field
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs font-medium focus:outline-none focus:border-primary/60 appearance-none cursor-pointer pr-8"
                  >
                    {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-3 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  Production Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs font-medium focus:outline-none focus:border-primary/60"
                />
              </div>

              {/* Custom Slug */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="lumina-spatial-os"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-xs font-mono focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            {/* Short Elevator Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                Short Summary (Card Caption) <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A concise 1-2 sentence description explaining the visual objective and highlight of this masterwork..."
                className="w-full p-3 rounded-xl border border-border bg-input-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none"
              />
            </div>

            {/* Full Case Study Narrative */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                In-Depth Narrative & Design Process
              </label>
              <textarea
                rows={5}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Explain the background, challenges, art direction, typography choices, and technical execution..."
                className="w-full p-3 rounded-xl border border-border bg-input-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          {/* 2. Media & Visual Assets Section */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
            <h2 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              <span>Cover & Gallery Media</span>
            </h2>

            {/* Cover Image Upload (Required) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground">
                Project Cover Thumbnail (Required) <span className="text-destructive">*</span>
              </label>

              {coverImage ? (
                <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 aspect-[16/9] max-h-72 group">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold shadow-md hover:bg-white/90 cursor-pointer"
                    >
                      Change Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="px-3.5 py-1.5 rounded-full bg-destructive text-white text-xs font-bold shadow-md hover:bg-destructive/90 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-8 text-center bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    {uploadingCover ? (
                      <Loader2 size={22} className="animate-spin text-primary" />
                    ) : (
                      <Upload size={22} />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">
                      {uploadingCover ? "Uploading to Supabase..." : "Click or Drag to Upload Cover"}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      PNG, JPG, WebP up to 10MB (Stored in Supabase Storage)
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileUpload}
                className="hidden"
              />

              {/* Direct URL input option */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-muted-foreground">or image URL:</span>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60 font-mono"
                />
              </div>
            </div>

            {/* Gallery Images Upload */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-foreground">
                    Case Study Multi-Image Gallery ({galleryImages.length})
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Upload full screens, responsive breakdowns, and zoomed details.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploadingGallery}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all cursor-pointer"
                >
                  {uploadingGallery ? (
                    <Loader2 size={13} className="animate-spin text-primary" />
                  ) : (
                    <Plus size={13} className="text-primary" />
                  )}
                  <span>Add Images</span>
                </button>
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryFilesUpload}
                className="hidden"
              />

              {/* Gallery Grid Preview */}
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border border-border aspect-[4/3] group bg-muted/30"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                        #{idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-destructive text-white hover:opacity-90 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground bg-muted/10">
                  No additional gallery screens added yet.
                </div>
              )}
            </div>
          </div>

          {/* 3. Styling & Classification */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
            <h2 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
              <Palette size={16} className="text-primary" />
              <span>Creative Tools, Tags & Palette</span>
            </h2>

            {/* Accent Color Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground">
                Brand Palette Accent
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccentColor(color)}
                    className={`w-7 h-7 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                      accentColor === color
                        ? "border-foreground scale-110 shadow-md ring-2 ring-primary/40"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {accentColor === color && (
                      <Check size={13} className="text-white" />
                    )}
                  </button>
                ))}
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#0057ff"
                  className="w-24 px-2.5 py-1 rounded-lg border border-border bg-input-background text-foreground text-xs font-mono ml-2"
                />
              </div>
            </div>

            {/* Software / Tools Tag Manager */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground flex items-center gap-1">
                <Wrench size={13} className="text-primary" />
                <span>Software & Tools Used</span>
              </label>

              {/* Preset Chips to click */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {POPULAR_TOOLS.slice(0, 8).map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => handleAddTool(tool)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                      tools.includes(tool)
                        ? "border-primary bg-primary text-primary-foreground font-bold"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    + {tool}
                  </button>
                ))}
              </div>

              {/* Active Tools Chips */}
              <div className="flex flex-wrap gap-1.5 items-center p-2.5 rounded-xl border border-border bg-input-background">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-card border border-border text-foreground text-xs font-semibold shadow-xs"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTool(t)}
                      className="hover:text-destructive transition-colors cursor-pointer"
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
                      handleAddTool();
                    }
                  }}
                  placeholder="Type tool & enter..."
                  className="flex-1 min-w-[120px] bg-transparent text-foreground text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Tags Manager */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground flex items-center gap-1">
                <Tag size={13} className="text-primary" />
                <span>Search Keywords & Tags</span>
              </label>

              <div className="flex flex-wrap gap-1.5 items-center p-2.5 rounded-xl border border-border bg-input-background">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add hashtag & press enter..."
                  className="flex-1 min-w-[120px] bg-transparent text-foreground text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Status Option */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="block text-xs font-bold text-foreground">
                Publication Visibility
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "published"}
                    onChange={() => setStatus("published")}
                    className="accent-primary"
                  />
                  <span>Published (Visible on Explore Feed & Profile)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "draft"}
                    onChange={() => setStatus("draft")}
                    className="accent-primary"
                  />
                  <span>Draft (Private to your Studio Dashboard)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-[0_0_20px_rgba(205,242,43,0.3)] hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>{isEditing ? "Save Changes" : "Publish Masterwork"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-2xl border border-border bg-card p-6 max-w-sm w-full space-y-4 shadow-2xl z-10"
            >
              <h3 className="text-base font-bold text-foreground">
                Delete this case study?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This action cannot be undone. The project will be removed from your portfolio and the explore feed.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-1.5 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-1.5 rounded-full bg-destructive text-white text-xs font-bold hover:opacity-90"
                >
                  Delete Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
