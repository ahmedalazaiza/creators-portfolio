import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  ArrowRight,
  Plus,
  Compass,
  SlidersHorizontal,
  FolderOpen,
  X,
  RotateCcw,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import CategorySectionSlider from "../components/CategorySectionSlider";
import SearchModal from "../components/SearchModal";
import { CATEGORIES, POPULAR_TOOLS, SORT_OPTIONS } from "../data/categories";
import { SortOption } from "../types";

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State from URL or defaults
  const paramQuery = searchParams.get("q") || "";
  const paramCategory = searchParams.get("category") || "all";
  const paramSub = searchParams.get("sub") || "all";
  const paramTool = searchParams.get("tool") || "";
  const paramSort = (searchParams.get("sort") as SortOption) || "featured";
  const paramTime = searchParams.get("time") || "all";

  const [searchQuery, setSearchQuery] = useState(paramQuery);
  const [activeCategory, setActiveCategory] = useState(paramCategory);
  const [activeSubCategory, setActiveSubCategory] = useState(paramSub);
  const [activeTool, setActiveTool] = useState(paramTool);
  const [sortBy, setSortBy] = useState<SortOption>(paramSort);
  const [activeTimeframe, setActiveTimeframe] = useState(paramTime);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setActiveCategory(searchParams.get("category") || "all");
    setActiveSubCategory(searchParams.get("sub") || "all");
    setActiveTool(searchParams.get("tool") || "");
    setSortBy((searchParams.get("sort") as SortOption) || "featured");
    setActiveTimeframe(searchParams.get("time") || "all");
  }, [searchParams]);

  // Hook to fetch and filter projects
  const { projects, allProjects, loading } = useProjects({
    searchQuery,
    category: activeCategory,
    subCategory: activeSubCategory,
    tool: activeTool,
    sortBy,
    timeframe: activeTimeframe,
  });

  // Calculate active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (activeCategory && activeCategory !== "all") count++;
    if (activeSubCategory && activeSubCategory !== "all") count++;
    if (activeTool) count++;
    if (sortBy !== "featured") count++;
    if (activeTimeframe !== "all") count++;
    return count;
  }, [searchQuery, activeCategory, activeSubCategory, activeTool, sortBy, activeTimeframe]);

  // Find active category object for sub-categories pill row
  const currentCategoryObj = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === activeCategory) || CATEGORIES[0];
  }, [activeCategory]);

  // Check if we are in default Multi-Category Sliders mode
  const isMultiCategoryMode = useMemo(() => {
    return (
      activeCategory === "all" &&
      !searchQuery.trim() &&
      !activeTool &&
      activeSubCategory === "all" &&
      activeTimeframe === "all"
    );
  }, [activeCategory, searchQuery, activeTool, activeSubCategory, activeTimeframe]);

  // Group all projects by category for the sliders mode
  const projectsByCategory = useMemo(() => {
    const map: Record<string, typeof allProjects> = {};
    CATEGORIES.filter((c) => c.slug !== "all").forEach((cat) => {
      const catSlug = cat.slug.toLowerCase();
      map[cat.slug] = allProjects.filter((p) => {
        if (p.status === "draft") return false;
        return (
          p.categoryId?.toLowerCase() === catSlug ||
          p.category.toLowerCase().includes(catSlug) ||
          catSlug.includes(p.category.toLowerCase().replace(/[^a-z0-9]/g, "-"))
        );
      });
    });
    return map;
  }, [allProjects]);

  // Update URL params helper
  const updateParams = (newParams: {
    q?: string;
    category?: string;
    sub?: string;
    tool?: string;
    sort?: SortOption;
    time?: string;
  }) => {
    const params = new URLSearchParams(searchParams);

    if (newParams.q !== undefined) {
      if (newParams.q.trim()) params.set("q", newParams.q.trim());
      else params.delete("q");
    }

    if (newParams.category !== undefined) {
      if (newParams.category !== "all") params.set("category", newParams.category);
      else params.delete("category");
    }

    if (newParams.sub !== undefined) {
      if (newParams.sub !== "all") params.set("sub", newParams.sub);
      else params.delete("sub");
    }

    if (newParams.tool !== undefined) {
      if (newParams.tool.trim()) params.set("tool", newParams.tool.trim());
      else params.delete("tool");
    }

    if (newParams.sort !== undefined) {
      if (newParams.sort !== "featured") params.set("sort", newParams.sort);
      else params.delete("sort");
    }

    if (newParams.time !== undefined) {
      if (newParams.time !== "all") params.set("time", newParams.time);
      else params.delete("time");
    }

    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setActiveSubCategory("all");
    updateParams({ category: slug, sub: "all" });
  };

  const handleSubCategoryChange = (slug: string) => {
    setActiveSubCategory(slug);
    updateParams({ sub: slug });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveSubCategory("all");
    setActiveTool("");
    setSortBy("featured");
    setActiveTimeframe("all");
    setSearchParams({}, { replace: true });
  };

  const handleApplyModalFilters = (filters: {
    searchQuery: string;
    category: string;
    subCategory: string;
    tool: string;
    sortBy: SortOption;
    timeframe: string;
  }) => {
    setSearchQuery(filters.searchQuery);
    setActiveCategory(filters.category);
    setActiveSubCategory(filters.subCategory);
    setActiveTool(filters.tool);
    setSortBy(filters.sortBy);
    setActiveTimeframe(filters.timeframe);

    updateParams({
      q: filters.searchQuery,
      category: filters.category,
      sub: filters.subCategory,
      tool: filters.tool,
      sort: filters.sortBy,
      time: filters.timeframe,
    });
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-4 sm:pt-6 pb-24 relative overflow-hidden"
    >
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8 sm:pb-10 text-center space-y-5">
        {/* Soft Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-[#171915] border border-slate-200 dark:border-white/10 shadow-xs text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          <Sparkles size={13} className="text-slate-500 dark:text-[#CDF22B]" />
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
          <span>exceptional case studies.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed"
        >
          A calm, elevated space to showcase design systems, 3D explorations, and digital craft with high-resolution imagery and genuine feedback.
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
            to="/creators"
            className="px-6 py-3 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-800 shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass size={15} className="text-foreground" />
            <span>Creators Directory</span>
          </Link>
        </motion.div>
      </section>

      {/* Discovery Search & Category Tags Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Advanced Search Bar with Filter Button */}
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center rounded-full glass-card border border-slate-200/90 dark:border-slate-800/90 shadow-lg shadow-slate-900/5 dark:shadow-black/20 focus-within:border-slate-400 dark:focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-400/15 transition-all p-1.5 pl-4 gap-2 backdrop-blur-xl">
            {/* Search Icon */}
            <Search size={18} className="text-slate-400 dark:text-slate-500 shrink-0" />

            {/* Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateParams({ q: e.target.value });
              }}
              placeholder="Search projects by title, keywords, tools, or creator..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-xs sm:text-sm font-medium focus:outline-none min-w-0"
            />

            {/* Clear (X) Button */}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  updateParams({ q: "" });
                }}
                aria-label="Clear search input"
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors shrink-0 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}

            {/* Filter Modal Trigger Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
                activeFiltersCount > 0
                  ? "bg-slate-900 dark:bg-[#CDF22B] text-white dark:text-slate-950 shadow-md"
                  : "bg-slate-100 dark:bg-[#171915] border border-transparent dark:border-white/10 hover:bg-slate-200 dark:hover:bg-[#1e231b] text-foreground"
              }`}
            >
              <SlidersHorizontal size={14} className={activeFiltersCount > 0 ? "text-[#CDF22B] dark:text-slate-950" : ""} />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#CDF22B] dark:bg-slate-950 text-slate-900 dark:text-[#CDF22B] font-bold text-[10px] flex items-center justify-center shadow-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Pills - Wrapped nicely without ugly horizontal scrollbars */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto py-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#CDF22B] text-slate-900 font-bold shadow-sm shadow-[#CDF22B]/30 scale-105"
                    : "glass-card text-muted-foreground hover:text-foreground border border-slate-200/70 dark:border-white/10 hover:border-[#CDF22B]/70"
                }`}
              >
                <span>{cat.name}</span>
                {cat.projectCount && (
                  <span
                    className={`text-[10px] opacity-70 ${
                      isActive ? "text-slate-900 font-mono font-bold" : ""
                    }`}
                  >
                    ({cat.projectCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-100/60 dark:bg-[#171915]/90 border border-slate-200/60 dark:border-white/10 text-xs max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-semibold">Active filters:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#1e231b] border border-slate-200 dark:border-white/10 text-foreground font-medium text-[11px]">
                  Keyword: "{searchQuery}"
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      updateParams({ q: "" });
                    }}
                    className="hover:text-rose-500 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#1e231b] border border-slate-200 dark:border-white/10 text-foreground font-medium text-[11px]">
                  Field: {currentCategoryObj.name}
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className="hover:text-rose-500 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {activeSubCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#1e231b] border border-slate-200 dark:border-white/10 text-foreground font-medium text-[11px]">
                  Sub: {activeSubCategory}
                  <button
                    onClick={() => handleSubCategoryChange("all")}
                    className="hover:text-rose-500 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {activeTool && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-foreground font-medium text-[11px]">
                  Tool: {activeTool}
                  <button
                    onClick={() => {
                      setActiveTool("");
                      updateParams({ tool: "" });
                    }}
                    className="hover:text-rose-500 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* ─── Projects Display: Category Sliders OR Filtered Grid ─────────────── */}
        {isMultiCategoryMode ? (
          /* Multi-Category Sliders Showcase (Default Home Browsing) */
          <div className="space-y-12 pt-4">
            {allProjects.length === 0 ? (
              <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 sm:p-16 text-center max-w-lg mx-auto space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles size={28} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground">
                    Creative Showcase is Initialized
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Be the pioneer creator to publish the first design system, case study, or 3D exploration to the platform.
                  </p>
                </div>
                <Link
                  to={isLoggedIn ? "/create" : "/signup"}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{isLoggedIn ? "Upload First Project" : "Join & Upload Work"}</span>
                </Link>
              </div>
            ) : (
              CATEGORIES.filter((c) => c.slug !== "all").map((category) => {
                const catProjects = projectsByCategory[category.slug] || [];
                return (
                  <CategorySectionSlider
                    key={category.id}
                    category={category}
                    projects={catProjects}
                    onExploreCategory={handleCategoryChange}
                  />
                );
              })
            )}
          </div>
        ) : (
          /* Single-Category / Filtered Search Grid Display */
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid size={18} className="text-slate-900 dark:text-[#CDF22B]" />
                <h2 className="text-lg font-bold text-foreground">
                  {currentCategoryObj.slug !== "all"
                    ? currentCategoryObj.name
                    : "Filtered Showcase"}
                </h2>
                <span className="text-xs text-muted-foreground font-mono">
                  ({projects.length} case studies found)
                </span>
              </div>

              {activeCategory !== "all" && (
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
                >
                  <span>View All Categories</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              /* Empty Results */
              <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-muted-foreground flex items-center justify-center mx-auto">
                  <FolderOpen size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">
                    No matching projects found
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Try adjusting your keyword, choosing another category, or resetting filters.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Interactive Filter Pop-up Modal */}
      <SearchModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialQuery={searchQuery}
        initialCategory={activeCategory}
        initialSubCategory={activeSubCategory}
        initialTool={activeTool}
        initialSort={sortBy}
        initialTimeframe={activeTimeframe}
        onApplyFilters={handleApplyModalFilters}
      />
    </motion.main>
  );
}
