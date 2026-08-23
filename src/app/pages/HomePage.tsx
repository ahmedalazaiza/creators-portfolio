import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  ArrowRight,
  Plus,
  Compass,
  Filter,
  Layers,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

const CATEGORIES = [
  "All Categories",
  "UI/UX Systems",
  "3D & CGI Motion",
  "Brand Identity",
  "Visual Art",
  "Typography",
  "Photography",
  "Architecture & Spatial",
];

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const { projects, loading } = useProjects();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  // Filter projects by category and search term
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Category match
      const matchCat =
        activeCategory === "All Categories" ||
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.categoryId?.toLowerCase() === activeCategory.toLowerCase().replace(/[^a-z0-9]/g, "-");

      // Search query match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.creator?.fullName?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 pb-24 relative overflow-hidden"
    >
      {/* Background Soft Atmospheric Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] brand-glow pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-10 sm:pb-12 text-center space-y-5">
        {/* Soft Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-xs font-semibold text-slate-900 dark:text-[#CDF22B] backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-[#CDF22B] shadow-xs" />
          <span>Curated Creative Showcase Platform</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-foreground leading-[1.1]"
        >
          Discover & publish <br className="hidden sm:inline" />
          <span className="relative inline-block">
            <span className="relative z-10">exceptional case studies.</span>
            <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#CDF22B]/60 -z-1 rounded-sm transform -rotate-1" />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed"
        >
          A free, calm space to showcase design systems, 3D explorations, and digital craft with high-resolution imagery and genuine feedback.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          {isLoggedIn ? (
            <Link
              to="/create"
              className="px-6 py-3 rounded-full btn-primary text-xs sm:text-sm font-bold active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Upload New Project</span>
            </Link>
          ) : (
            <Link
              to="/signup"
              className="px-6 py-3 rounded-full btn-primary text-xs sm:text-sm font-bold active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started for Free</span>
              <ArrowRight size={15} />
            </Link>
          )}

          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-800 shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass size={15} className="text-foreground" />
            <span>Creator Studio</span>
          </Link>
        </motion.div>
      </section>

      {/* Discovery Search & Category Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Soft Search Input */}
        <div className="max-w-2xl mx-auto relative flex items-center">
          <Search size={18} className="absolute left-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, keywords, or creator..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#CDF22B]/40 focus:border-[#CDF22B] shadow-sm transition-all font-medium"
          />
        </div>

        {/* Category Carousel Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#CDF22B] text-slate-900 shadow-sm shadow-[#CDF22B]/30"
                    : "glass-card text-muted-foreground hover:text-foreground border border-slate-200/70 dark:border-slate-800/70 hover:border-[#CDF22B]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid Display */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          /* Empty Search / Category Result State */
          <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-muted-foreground flex items-center justify-center mx-auto">
              <FolderOpen size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                No matching projects found
              </h3>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search query or selecting another category filter.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All Categories");
              }}
              className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-foreground cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </motion.main>
  );
}
