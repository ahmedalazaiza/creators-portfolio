import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  Search,
  ArrowRight,
  Plus,
  Layers,
  Compass,
  Users,
  Eye,
  Heart,
  FolderPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All Categories",
    "UI/UX Systems",
    "3D & CGI Motion",
    "Brand Identity",
    "Visual Art",
    "Typography",
    "Photography",
  ];
  const [activeCategory, setActiveCategory] = useState("All Categories");

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 pb-24 relative overflow-hidden"
    >
      {/* Background Pastel Atmospheric Gradients */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center space-y-6">
        {/* Soft Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-xs font-medium text-muted-foreground backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>Next-Generation Creative Showcase Platform</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-foreground leading-[1.1]"
        >
          Where creativity finds its{" "}
          <span className="pastel-gradient-text">calm, pure space.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
        >
          A completely free, modern portfolio platform for designers, artists, and creators to share case studies, gain inspiration, and connect effortlessly.
        </motion.p>

        {/* Call to action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          {isLoggedIn ? (
            <Link
              to="/create"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create New Project</span>
            </Link>
          ) : (
            <Link
              to="/signup"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started for Free</span>
              <ArrowRight size={15} />
            </Link>
          )}

          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-full glass-card hover:bg-white dark:hover:bg-slate-800 text-foreground text-xs sm:text-sm font-semibold border border-slate-200/80 dark:border-slate-800/80 shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass size={15} className="text-indigo-500" />
            <span>Open Studio</span>
          </Link>
        </motion.div>
      </section>

      {/* Discovery Search & Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Soft Search Input */}
        <div className="max-w-2xl mx-auto relative flex items-center">
          <Search size={18} className="absolute left-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, categories, or keywords..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-md transition-all"
          />
        </div>

        {/* Category Pills Carousel */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 font-semibold"
                    : "glass-card text-muted-foreground hover:text-foreground border border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Clean Empty Placeholder Grid (Ready for Phase 2) */}
        <div className="pt-6">
          <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 sm:p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <FolderPlus size={26} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Foundation Ready — No Projects Yet
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                You have completed MVP 1 (Design System & Authentication). In the upcoming Phase 2, real projects will be uploaded and showcased right here!
              </p>
            </div>

            {isLoggedIn ? (
              <Link
                to="/create"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 cursor-pointer"
              >
                <Plus size={14} />
                <span>Create Test Project</span>
              </Link>
            ) : (
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 cursor-pointer"
              >
                <span>Join & Start Creating</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
