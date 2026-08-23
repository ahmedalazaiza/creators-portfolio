import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  Search,
  Users,
  Eye,
  Heart,
  ArrowUpRight,
  Plus,
  Compass,
  Check,
  Flame,
  LayoutDashboard,
  Award,
  Filter,
  ArrowRight,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useCreator } from "../hooks/useCreator";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import FilterBar from "../components/FilterBar";
import { SortOption } from "../types";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [activeTool, setActiveTool] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const { user } = useAuth();
  const { allCreators, toggleFollow } = useCreator();

  // Sync category param with URL
  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const handleClearFilters = () => {
    setActiveCategory("all");
    setActiveTool("");
    setSearchQuery("");
    setSortBy("featured");
    setSearchParams({});
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory && activeCategory !== "all") count++;
    if (activeTool) count++;
    if (searchQuery) count++;
    if (sortBy !== "featured") count++;
    return count;
  }, [activeCategory, activeTool, searchQuery, sortBy]);

  const { projects, loading } = useProjects({
    category: activeCategory,
    tool: activeTool,
    searchQuery,
    sortBy,
  });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 sm:pt-16 pb-16"
    >
      {/* High-Impact Modern Hero Showcase Section (#CDF22B & #1E45FB Palette) */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-8 sm:pb-12 border-b border-border/40 bg-gradient-to-b from-[#1E45FB]/12 via-card/30 to-background">
        {/* Glow Spheres */}
        <div className="absolute -top-12 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#1E45FB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-72 sm:w-80 h-72 sm:h-80 bg-[#CDF22B]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
            {/* Electric Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#CDF22B]/40 bg-[#CDF22B]/10 text-primary text-[11px] font-mono font-bold tracking-wide shadow-[0_0_15px_rgba(205,242,43,0.15)]"
            >
              <Sparkles size={12} className="text-[#CDF22B]" />
              <span>Azaiza Gallery — Curated Creative Benchmark</span>
            </motion.div>

            {/* Headline with High-Contrast Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-foreground tracking-tight leading-[1.12]"
            >
              Discover & Showcase <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E45FB] via-foreground to-[#CDF22B]">
                Visionary Craft
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl"
            >
              Explore benchmark case studies in UI/UX systems, 3D CGI direction, spatial architecture, and brand identity from verified creators worldwide.
            </motion.p>

            {/* Direct Action Hub */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="pt-2 flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                to="/creators"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E45FB] text-white font-bold text-xs shadow-[0_0_20px_rgba(30,69,251,0.35)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Users size={14} />
                <span>Explore Top Creators</span>
                <ArrowRight size={13} />
              </Link>

              <Link
                to={user ? "/dashboard/new" : "/signup"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/50 bg-[#CDF22B] text-[#070a14] font-bold text-xs shadow-[0_0_20px_rgba(205,242,43,0.3)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Share Masterwork</span>
              </Link>
            </motion.div>

            {/* Metrics Ribbon */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <Compass size={13} className="text-[#1E45FB] dark:text-[#CDF22B]" />
                <span className="font-bold text-foreground">2,800+</span> Curated Works
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-[#1E45FB] dark:text-[#CDF22B]" />
                <span className="font-bold text-foreground">420+</span> Visionary Creators
              </div>
              <div className="flex items-center gap-1.5">
                <Heart size={13} className="text-rose-500 fill-rose-500/20" />
                <span className="font-bold text-foreground">125K</span> Appreciations
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Behance Sticky Sub-header & Filter Bar */}
      <div className="sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border py-3 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            onClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>

      {/* Featured Creators Carousel (Behance Top Creatives) */}
      <section id="creators" className="py-4 border-b border-border/30 bg-card/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Flame size={14} className="text-amber-400" />
              <span>Recommended Creators to Follow</span>
            </div>
            <Link
              to="/creators"
              className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1"
            >
              View all creators <ArrowUpRight size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {allCreators.slice(0, 4).map((creator) => {
              const following = creator.isFollowing;
              return (
                <div
                  key={creator.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all group"
                >
                  <Link
                    to={`/@${creator.username}`}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={creator.avatarUrl}
                        alt={creator.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                      {creator.availableForWork && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-background" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {creator.fullName}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        @{creator.username}
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`shrink-0 text-[10px] px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      following
                        ? "bg-muted text-muted-foreground border border-border"
                        : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Behance Multi-Column Feed Grid */}
      <section className="pt-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Counter Bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-muted-foreground">
            Explore <strong className="text-foreground">{projects.length}</strong> case studies
            {activeCategory !== "all" && (
              <span>
                {" "}in <span className="text-primary font-bold">{activeCategory}</span>
              </span>
            )}
          </span>
        </div>

        {/* Behance Discovery Grid (4-5 columns) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-7">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="space-y-2.5">
                <div className="aspect-[4/3] rounded-xl bg-muted/40 animate-pulse border border-border" />
                <div className="h-4 bg-muted/40 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto text-muted-foreground">
              <Search size={20} />
            </div>
            <h3 className="text-base font-bold text-foreground">No projects found</h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your creative category or software filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-7">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.2) }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Behance-Style CTA Banner */}
        <section className="mt-14 relative rounded-2xl overflow-hidden border border-primary/25 bg-card/90 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E45FB]/15 via-card to-[#CDF22B]/15 pointer-events-none" />
          <div className="relative z-10 px-6 py-8 sm:px-12 sm:py-10 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-[11px] font-mono font-bold">
              <Sparkles size={12} />
              <span>Share Your Work on Azaiza Gallery</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
              Ready to showcase your craft to the world?
            </h2>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Publish rich case studies, get discovered by creative directors, and join a thriving community of over 420+ designers.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={user ? "/dashboard/new" : "/signup"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-[0_0_20px_rgba(205,242,43,0.3)] hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Publish Project</span>
                <ArrowUpRight size={14} />
              </Link>

              <Link
                to="/creators"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all cursor-pointer"
              >
                <Users size={13} className="text-primary" />
                <span>Discover Creators</span>
              </Link>
            </div>
          </div>
        </section>
      </section>
    </motion.main>
  );
}
