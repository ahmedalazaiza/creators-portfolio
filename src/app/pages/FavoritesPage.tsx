import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Bookmark,
  Heart,
  Search,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  SlidersHorizontal,
  Compass,
  ArrowLeft,
  X,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { CATEGORIES } from "../data/categories";

export default function FavoritesPage() {
  const { allProjects, loading } = useProjects();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter only saved/favorited projects
  const favoriteProjects = useMemo(() => {
    return allProjects.filter((p) => Boolean(p.isSaved));
  }, [allProjects]);

  // Apply search & category filter inside favorites
  const filteredFavorites = useMemo(() => {
    return favoriteProjects.filter((project) => {
      // Category match
      if (selectedCategory !== "all" && project.categoryId !== selectedCategory) {
        return false;
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
  }, [favoriteProjects, selectedCategory, searchQuery]);

  // ─── 1. Guest Screen (User is not logged in) ───────────────────────────
  if (!isLoggedIn) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-card p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl text-center space-y-6 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#CDF22B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#CDF22B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-3xl bg-[#CDF22B] text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-[#CDF22B]/30 font-bold">
            <Bookmark size={28} className="fill-current" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-[#CDF22B] text-xs font-bold border border-slate-200 dark:border-slate-700">
              <Lock size={12} />
              <span>Registered Members Only</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
              Access Your Favorites
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Sign in with your creative profile to save inspiring case studies, organize custom moodboards, and sync across all your devices.
            </p>
          </div>

          {/* Value Props */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-left text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CDF22B]" />
              <span>Bookmark unlimited UI/UX & 3D projects</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CDF22B]" />
              <span>Real-time cloud sync with Supabase</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CDF22B]" />
              <span>Direct inquiries with featured creators</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              to="/login"
              state={{ from: "/favorites" }}
              className="w-full py-3 rounded-full btn-primary text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
            >
              <span>Sign In to View Favorites</span>
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

  // ─── 2. Authenticated User Favorites Screen ────────────────────────────
  return (
    <main className="min-h-screen pt-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#CDF22B]/25 font-bold">
              <Bookmark size={20} className="fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
                  Saved Favorites
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-slate-800 text-[#CDF22B] text-xs font-mono font-bold">
                  {favoriteProjects.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your curated personal collection of inspiring design work and case studies.
              </p>
            </div>
          </div>
        </div>

        {/* Explore More CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#CDF22B] hover:text-slate-900 text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Compass size={14} />
          <span>Discover More Works</span>
        </Link>
      </div>

      {/* Filter & Search Bar (Only shown if user has saved items) */}
      {favoriteProjects.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden no-scrollbar w-full md:w-auto pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({favoriteProjects.length})
            </button>
            {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
              const count = favoriteProjects.filter((p) => p.categoryId === cat.slug).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    selectedCategory === cat.slug
                      ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{cat.name.split(" ")[0]}</span>
                  <span className="opacity-70 font-mono text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in favorites..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Projects Grid OR Empty State */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFavorites.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl p-10 sm:p-16 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-muted-foreground flex items-center justify-center mx-auto">
            <Bookmark size={28} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground">
              {searchQuery || selectedCategory !== "all"
                ? "No matching favorites found"
                : "No saved projects yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search query or discipline filter."
                : "Browse the showcase directory and tap the bookmark icon on any project to curate your personal collection."}
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer active:scale-95"
            >
              <Compass size={14} />
              <span>Explore Projects Directory</span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
