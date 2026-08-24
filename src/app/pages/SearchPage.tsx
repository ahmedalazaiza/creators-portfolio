import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Users,
  Eye,
  Heart,
  ArrowUpRight,
  Wrench,
  Tag,
  ArrowUpDown,
  Check,
  Flame,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useCreator } from "../hooks/useCreator";
import ProjectCard from "../components/ProjectCard";
import FilterBar from "../components/FilterBar";
import { SortOption } from "../types";
import { CATEGORIES } from "../data/categories";

const SEARCH_SUGGESTIONS = [
  "Spatial UI",
  "Blender 3D",
  "Figma Design System",
  "Cyberpunk",
  "Branding Identity",
  "Typography",
  "Cinema 4D",
  "Architecture",
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialTool = searchParams.get("tool") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTool, setActiveTool] = useState(initialTool);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const { projects, loading } = useProjects({
    searchQuery: query,
    category: activeCategory,
    tool: activeTool,
    sortBy,
  });

  const { creatorsList } = useCreator();
  const allCreators = creatorsList || [];

  // Sync with URL params
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query) setQuery(q);
  }, [searchParams]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      searchParams.set("q", val);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "all") searchParams.delete("category");
    else searchParams.set("category", slug);
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setActiveTool("");
    setSortBy("featured");
    setSearchParams({});
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query.trim()) count++;
    if (activeCategory && activeCategory !== "all") count++;
    if (activeTool) count++;
    if (sortBy !== "featured") count++;
    return count;
  }, [query, activeCategory, activeTool, sortBy]);

  // Matching creators
  const matchedCreators = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allCreators.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.skills?.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [query, allCreators]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-4 sm:pt-6 pb-20 bg-background"
    >
      {/* Search Header Stage */}
      <section className="border-b border-border/40 bg-gradient-to-b from-[#CDF22B]/15 via-card/20 to-background py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="max-w-2xl mx-auto space-y-3 text-center">
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
              Explore & Search Masterworks
            </h1>
            <p className="text-xs text-muted-foreground">
              Search by project keywords, creator name, software (Figma, Blender), or design disciplines.
            </p>

            {/* Main Search Input */}
            <div className="relative flex items-center pt-2">
              <Search size={18} className="absolute left-4 text-primary" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search projects, creators, Figma, 3D CGI..."
                className="w-full pl-12 pr-24 py-3 rounded-full border border-border bg-card text-foreground text-xs shadow-lg focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
              {query && (
                <button
                  onClick={() => handleQueryChange("")}
                  className="absolute right-3.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-muted-foreground hover:text-foreground bg-muted cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              <span className="text-[11px] font-mono text-muted-foreground mr-1">
                Trending:
              </span>
              {SEARCH_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleQueryChange(suggestion)}
                  className="px-2.5 py-0.5 rounded-full border border-border bg-card/60 hover:border-primary/40 hover:text-primary text-[11px] font-medium text-muted-foreground transition-all cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter Controls */}
      <div className="sticky top-14 sm:top-16 z-20 bg-background/95 backdrop-blur-md border-b border-border py-3 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            onClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>

      {/* Main Results Grid */}
      <section className="pt-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Matching Creators Preview (if any) */}
        {matchedCreators.length > 0 && (
          <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Users size={14} className="text-primary" />
              <span>Matching Creators ({matchedCreators.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {matchedCreators.map((c) => (
                <Link
                  key={c.id}
                  to={`/@${c.username}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
                >
                  <img
                    src={c.avatarUrl}
                    alt={c.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">
                      {c.fullName}
                    </div>
                    <div className="text-[10px] text-primary font-mono truncate">
                      @{c.username}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">
            Found <strong className="text-foreground">{projects.length}</strong> masterworks
            {query && <span> for "<span className="text-primary font-bold">{query}</span>"</span>}
          </span>
        </div>

        {/* Grid / Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-7">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="space-y-2.5">
                <div className="aspect-[4/3] rounded-xl bg-muted/40 animate-pulse border border-border" />
                <div className="h-4 bg-muted/40 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mx-auto text-muted-foreground">
              <Search size={22} />
            </div>
            <h3 className="text-base font-bold text-foreground">
              No matching projects found
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We couldn't find any masterworks matching your criteria. Try searching for broader terms or resetting filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-7">
            {projects.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.025, 0.2) }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.main>
  );
}
