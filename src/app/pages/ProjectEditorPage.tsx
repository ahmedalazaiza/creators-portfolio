import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  UploadCloud,
  Image as ImageIcon,
  Plus,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Wrench,
  Tag,
  Eye,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import EmailVerificationModal from "../components/EmailVerificationModal";

const CATEGORIES = [
  "UI/UX Systems",
  "3D & CGI Motion",
  "Brand Identity",
  "Visual Art",
  "Typography",
  "Photography",
  "Architecture & Spatial",
  "Motion Graphics",
];

const PRESET_TOOLS = [
  "Figma",
  "Cinema 4D",
  "Blender",
  "Octane Render",
  "Houdini",
  "After Effects",
  "Illustrator",
  "Photoshop",
  "React",
  "Tailwind CSS",
  "Protopie",
  "Spline",
];

export default function ProjectEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, isEmailVerified } = useAuth();
  const { saveProject, getProjectBySlug, deleteProject } = useProjects();

  const isEditing = Boolean(id);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("UI/UX Systems");
  const [coverImage, setCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Case Study", "Design"]);
  const [toolInput, setToolInput] = useState("");
  const [tools, setTools] = useState<string[]>(["Figma"]);

  // UI state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Load project if editing & verify creator ownership
  useEffect(() => {
    if (id) {
      const existing = getProjectBySlug(id);
      if (existing) {
        // Prevent editing someone else's project
        if (
          user &&
          existing.userId &&
          existing.userId !== user.id &&
          existing.creator?.username?.toLowerCase() !== user.username?.toLowerCase()
        ) {
          navigate("/dashboard");
          return;
        }
        setTitle(existing.title || "");
        setDescription(existing.description || existing.fullDescription || "");
        setCategory(existing.category || "UI/UX Systems");
        setCoverImage(existing.coverImage || "");
        setGalleryImages(existing.images || []);
        setTags(existing.tags || []);
        setTools(existing.tools || []);
      }
    }
  }, [id, user, getProjectBySlug, navigate]);

  // Helper for Uploading to Supabase Storage or Base64 fallback
  const uploadImageFile = async (file: File): Promise<string> => {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("projects")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from("projects").getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (err) {
        console.warn("Storage upload failed, using local reader:", err);
      }
    }

    // Fallback to Data URL for instant rendering & offline local state
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setErrorMsg("");

    try {
      const url = await uploadImageFile(file);
      setCoverImage(url);
    } catch (err: any) {
      setErrorMsg("Failed to upload cover image. Please try again.");
    } finally {
      setUploadingCover(false);
    }
  };

  // Handle Gallery Images Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    setErrorMsg("");

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImageFile(files[i]);
        newUrls.push(url);
      }
      setGalleryImages((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      setErrorMsg("Failed to upload some gallery images.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Tag
  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, "");
    if (clean && !tags.includes(clean)) {
      setTags((prev) => [...prev, clean]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Add Tool
  const handleAddTool = (toolName: string) => {
    const clean = toolName.trim();
    if (clean && !tools.includes(clean)) {
      setTools((prev) => [...prev, clean]);
    }
  };

  const removeTool = (toolToRemove: string) => {
    setTools((prev) => prev.filter((t) => t !== toolToRemove));
  };

  // Submit & Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Guard: Prevent unverified accounts from publishing projects
    if (!isEmailVerified) {
      setShowVerificationModal(true);
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Please enter a project title.");
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Please enter a short project description.");
      return;
    }

    if (!coverImage) {
      setErrorMsg("Cover image is required. Please upload or provide a cover image.");
      return;
    }

    setSaving(true);
    try {
      const allImages = galleryImages.length > 0 ? [coverImage, ...galleryImages] : [coverImage];

      const saved = await saveProject(
        {
          id: id || undefined,
          title: title.trim(),
          description: description.trim(),
          fullDescription: description.trim(),
          category,
          coverImage,
          images: allImages,
          tags,
          tools,
          status: "published",
          accentColor: "#CDF22B",
        },
        user
          ? {
              id: user.id,
              username: user.username,
              fullName: user.fullName,
              avatarUrl:
                user.avatarUrl ||
                `https://api.dicebear.com/7.x/shapes/svg?seed=${user.username}`,
              headline: user.headline,
              bio: user.bio,
              location: user.location,
              website: user.website,
            }
          : null
      );

      setSuccessMsg("Project saved and published successfully!");
      setTimeout(() => {
        navigate(`/project/${saved.slug || saved.id}`);
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-8 sm:pt-10 pb-24 max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 space-y-8"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="inline-flex items-center gap-2">
          {isEditing && id && (
            <button
              type="button"
              onClick={async () => {
                if (confirm("Are you sure you want to delete this project?")) {
                  await deleteProject(id);
                  navigate("/dashboard");
                }
              }}
              className="px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CDF22B]/20 border border-[#CDF22B]/50 text-slate-900 dark:text-[#CDF22B] text-xs font-mono font-semibold">
            <Sparkles size={13} />
            <span>{isEditing ? "Edit Project" : "Project Upload Studio"}</span>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
          {isEditing ? "Edit Your Project" : "Publish a New Project"}
        </h1>
        <p className="text-xs text-muted-foreground">
          Showcase your creative case study with high-res imagery, tool tags, and clear concept context.
        </p>
      </div>

      {/* Error & Success Feedback Alerts */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            className="p-4 rounded-2xl bg-[#CDF22B]/20 border border-[#CDF22B]/60 text-slate-900 dark:text-[#CDF22B] text-xs flex items-center gap-2.5 font-medium"
          >
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-[#CDF22B]" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Upload Form Card */}
      <form onSubmit={handleSaveProject} className="space-y-8">
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-md space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
              <Layers size={16} className="text-[#CDF22B]" />
              <span>Project Details</span>
            </h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Project Title <span className="text-slate-900 dark:text-white">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Aura — Kinetic Spatial Design System"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#171915] text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] focus:ring-2 focus:ring-[#CDF22B]/30 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Creative Category <span className="text-slate-900 dark:text-white">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#171915] text-foreground text-xs sm:text-sm focus:outline-none focus:border-[#CDF22B] focus:ring-2 focus:ring-[#CDF22B]/30 transition-all cursor-pointer font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Creation Year
                </label>
                <input
                  type="text"
                  defaultValue={new Date().getFullYear().toString()}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#171915] text-foreground text-xs sm:text-sm focus:outline-none focus:border-[#CDF22B] focus:ring-2 focus:ring-[#CDF22B]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Project Description & Concept <span className="text-slate-900 dark:text-white">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the background, creative challenges, aesthetic decisions, and deliverables..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#171915] text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] focus:ring-2 focus:ring-[#CDF22B]/30 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Cover Image (Required) */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-foreground">
                Cover Image <span className="text-slate-900 dark:text-white font-medium">* (Main Showcase)</span>
              </label>
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="text-xs text-rose-500 hover:underline cursor-pointer"
                >
                  Remove Cover
                </button>
              )}
            </div>

            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />

            {coverImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group aspect-video sm:aspect-21/9 bg-slate-100 dark:bg-[#171915]">
                <img
                  src={coverImage}
                  alt="Project cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md cursor-pointer hover:bg-slate-100"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-white/15 hover:border-[#CDF22B] rounded-3xl p-8 sm:p-12 text-center space-y-3 bg-slate-50/50 dark:bg-[#171915]/60 cursor-pointer transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  {uploadingCover ? (
                    <Loader2 size={24} className="animate-spin text-slate-900 dark:text-[#CDF22B]" />
                  ) : (
                    <UploadCloud size={26} />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    {uploadingCover ? "Uploading cover image..." : "Click to upload main cover image"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Recommended resolution 1920×1080px (PNG, JPG, WEBP)
                  </p>
                </div>

                {/* Direct Image URL fallback input */}
                <div
                  className="pt-2 max-w-sm mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="url"
                    placeholder="Or paste an image URL here..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) setCoverImage(val);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val) setCoverImage(val);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#171915] text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Multi-image Gallery */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Gallery & Detailed Views ({galleryImages.length})
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Upload additional process screenshots, wireframes, or high-res mockups.
                </p>
              </div>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 hover:bg-slate-200 text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Images</span>
              </button>
            </div>

            <input
              type="file"
              ref={galleryInputRef}
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />

            {/* Gallery Grid */}
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {galleryImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group bg-slate-100 dark:bg-[#171915]"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-[#CDF22B] flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {uploadingGallery ? (
                    <Loader2 size={18} className="animate-spin text-slate-900 dark:text-[#CDF22B]" />
                  ) : (
                    <>
                      <Plus size={18} />
                      <span className="text-[11px] font-medium mt-1">Upload More</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-muted-foreground hover:bg-slate-50 dark:hover:bg-[#1e231b]/60 cursor-pointer transition-colors"
              >
                <span>No gallery images added yet. Click to upload extra images.</span>
              </div>
            )}
          </div>

          {/* Section 4: Tags & Tools */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/10">
            {/* Tools Used */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Wrench size={13} className="text-[#CDF22B]" />
                <span>Tools Used</span>
              </label>

              {/* Tool Chips */}
              <div className="flex flex-wrap gap-1.5">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1e231b] border border-slate-200 dark:border-white/10 text-foreground text-xs font-medium"
                  >
                    <span>{tool}</span>
                    <button
                      type="button"
                      onClick={() => removeTool(tool)}
                      aria-label={`Remove ${tool}`}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Preset suggestions */}
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[11px] text-muted-foreground mr-1 self-center">
                  Quick add:
                </span>
                {PRESET_TOOLS.filter((t) => !tools.includes(t))
                  .slice(0, 7)
                  .map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddTool(preset)}
                      className="px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10 hover:border-[#CDF22B] text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
              </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Tag size={13} className="text-[#CDF22B]" />
                <span>Tags & Keywords</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CDF22B]/15 text-slate-900 dark:text-[#CDF22B] text-xs font-semibold border border-[#CDF22B]/35 transition-colors"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      aria-label={`Remove ${t}`}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-slate-600 dark:text-[#CDF22B]/80 hover:text-slate-950 dark:hover:text-[#CDF22B] hover:bg-[#CDF22B]/30 transition-colors cursor-pointer"
                    >
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-sm">
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
                  placeholder="Type a tag and press Add..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#171915] text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl btn-secondary text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-full btn-secondary text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full btn-primary active:scale-95 text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Publishing Project...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>{isEditing ? "Update Project" : "Publish Project"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Email Verification Modal Guard */}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </motion.main>
  );
}
