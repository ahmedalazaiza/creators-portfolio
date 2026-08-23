import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  UploadCloud,
  Layers,
  Image as ImageIcon,
  Check,
  FolderPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProjectEditorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("UI/UX Systems");

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-medium">
          <Sparkles size={12} />
          <span>Project Builder — MVP 1 Preview</span>
        </div>
      </div>

      {/* Editor Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
          Create New Project
        </h1>
        <p className="text-xs text-muted-foreground">
          Prepare your case study metadata. Full multi-image upload & drag-and-drop will arrive in Phase 2.
        </p>
      </div>

      {/* Project Studio Form Placeholder Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lumina — Spatial Design System & UI Kit"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Creative Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-foreground text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                <option value="UI/UX Systems">UI/UX Systems</option>
                <option value="3D & CGI Motion">3D & CGI Motion</option>
                <option value="Brand Identity">Brand Identity</option>
                <option value="Visual Art">Visual Art</option>
                <option value="Photography">Photography</option>
                <option value="Typography">Typography</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Visibility
              </label>
              <select
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-foreground text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                <option value="public">Public (Visible in Explore feed)</option>
                <option value="unlisted">Unlisted (Direct link only)</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Short Description & Concept
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the key goals, visual direction, and creative techniques..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>

          {/* Visual Showcase Dropzone Placeholder */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-foreground">
              Project Cover & Media Canvas
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                <UploadCloud size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  Drag & Drop Project Media
                </p>
                <p className="text-[11px] text-muted-foreground">
                  High-res PNG, JPG, GIF, or MP4 up to 50MB (Ready in Phase 2)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Save Draft
          </button>
        </div>
      </div>
    </motion.main>
  );
}
