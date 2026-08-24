import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Bookmark,
  Search,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  SlidersHorizontal,
  Compass,
  ArrowLeft,
  X,
  FolderOpen,
  Plus,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { CATEGORIES, matchesCategory } from "../data/categories";

export default function SavedPage() {
  const { user, isLoggedIn } = useAuth();
  const { allProjects, loading } = useProjects(undefined, user?.id);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter bookmarked/saved projects
  const savedProjects = useMemo(() => {
    return allProjects.filter((p) => Boolean(p.isSaved));
  }, [allProjects]);

  // Apply search & category filter inside saved projects
  const filteredSaved = useMemo(() => {
    return savedProjects.filter((project) => {
      // Category match
      if (selectedCategory !== "all") {
        if (!matchesCategory(project.category, project.categoryId, project.tags, selectedCategory)) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);
        const matchesCreator = project.creator?.fullName?.toLowerCase().includes(q) || false;
        const matchesTags = project.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        if (!matchesTitle && !matchesDesc && !matchesCreator && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [savedProjects, selectedCategory, searchQuery]);

  // ─── 1. Guest Screen (User is not logged in) ───────────────────────────
  if (!isLoggedIn) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-card p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl text-center space-y-6 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#CDF22B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#CDF22B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-3xl bg-[#CDF22B] text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-[#CDF22B]/30 font-bold">
            <Bookmark size={28} className="fill-current" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#171915] text-[#0F172A] dark:text-[#CDF22B] text-xs font-bold border border-slate-200 dark:border-white/10">
              <Lock size={12} />
              <span>Registered Members Only</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
              Saved Collections
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Sign in with your creative profile to bookmark inspiring case studies, organize custom moodboards, and sync across all your devices.
            </p>
          </div>

          {/* Value Props */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#171915]/90 border border-slate-200/60 dark:border-white/10 text-left text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CDF22B]" />
              <span>Bookmark unlimited UI/UX & 3D projects</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CDF22B]" />
              <span>Organize design references and moodboards</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CDF22B]" />
              <span>Real-time cloud sync with your profile</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              to="/login"
              state={{ from: "/saved" }}
              className="w-full py-3 rounded-full btn-primary text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98 text-[#0F172A]"
            >
              <span>Sign In to View Saved Works</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Return to Explore</span>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // ─── 2. Authenticated User Saved Screen ────────────────────────────────
  return (
    <main className="min-h-screen pt-6 pb-20 max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#CDF22B]/25 font-bold">
              <Bookmark size={20} className="fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
                  Saved Collections
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-[#CDF22B] text-xs font-mono font-bold">
                  {savedProjects.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your bookmarked case studies and design references saved for later exploration.
              </p>
            </div>
          </div>
        </div>

        {/* Explore More CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full btn-secondary text-xs font-bold transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Compass size={14} />
          <span>Discover More Works</span>
        </Link>
      </div>

      {/* Filter & Search Bar (Only shown if user has saved items) */}
      {savedProjects.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden no-scrollbar w-full md:w-auto pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 shadow-xs"
                  : "bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({savedProjects.length})
            </button>

            {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
              const count = savedProjects.filter((p) =>
                matchesCategory(p.category, p.categoryId, p.tags, cat.slug)
              ).length;
              if (count === 0) return null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    selectedCategory === cat.slug
                      ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 shadow-xs font-bold"
                      : "bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Inner Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your saved works..."
              className="w-full pl-9 pr-8 py-1.5 rounded-full bg-slate-100 dark:bg-[#171915] border border-slate-200/80 dark:border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-[#CDF22B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Projects Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card rounded-3xl aspect-4/3 animate-pulse border border-slate-200 dark:border-white/10" />
          ))}
        </div>
      ) : filteredSaved.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSaved.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : savedProjects.length > 0 ? (
        /* Search/Filter Yielded No Results */
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10 max-w-md mx-auto space-y-4">
          <p className="text-sm font-semibold text-foreground">No saved works match your search</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 rounded-full btn-secondary text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* User Has Zero Saved Projects */
        <div className="glass-card rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 dark:border-white/10 max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-[#1e231b] flex items-center justify-center mx-auto text-muted-foreground">
            <Bookmark size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-foreground">
              You haven't saved any projects yet
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Bookmark case studies to create your custom moodboards and reference collections anytime.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer active:scale-95 text-[#0F172A]"
          >
            <span>Explore Community Showcase</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </main>
  );
}
