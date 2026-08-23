import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
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
  Rss,
  UserCheck,
  Zap,
  Bookmark,
  SlidersHorizontal,
  ChevronDown,
  Image as ImageIcon,
  Briefcase,
  Camera,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useCreator } from "../hooks/useCreator";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useRecommendations } from "../hooks/useRecommendations";
import ProjectCard from "../components/ProjectCard";
import FilterBar from "../components/FilterBar";
import { SortOption, FeedType } from "../types";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const feedParam = (searchParams.get("feed") as FeedType) || "for-you";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [activeTool, setActiveTool] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [activeFeed, setActiveFeed] = useState<FeedType>(feedParam);
  const [searchTab, setSearchTab] = useState<"projects" | "people" | "assets" | "images">("projects");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { user } = useAuth();
  const { allCreators, toggleFollow } = useCreator();
  const { t } = useLanguage();
  const { recommendedProjects } = useRecommendations();
  const navigate = useNavigate();

  // Sync category param with URL
  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setActiveFeed(feedParam);
  }, [feedParam]);

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug, feed: activeFeed });
    }
  };

  const handleFeedChange = (feed: FeedType) => {
    setActiveFeed(feed);
    if (feed === "for-you") {
      searchParams.delete("feed");
    } else {
      searchParams.set("feed", feed);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setActiveCategory("all");
    setActiveTool("");
    setSearchQuery("");
    setSortBy("featured");
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === "people") {
      navigate(`/creators?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${activeCategory}`);
    }
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

  // Following Feed Filter
  const displayedFeedProjects = useMemo(() => {
    if (activeFeed === "following") {
      const followedCreatorIds = allCreators
        .filter((c) => c.isFollowing)
        .map((c) => c.id);

      return projects.filter(
        (p) =>
          followedCreatorIds.includes(p.userId) ||
          allCreators.some((c) => c.isFollowing && c.username === p.creator.username)
      );
    }
    return projects;
  }, [projects, activeFeed, allCreators]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 sm:pt-16 pb-16 bg-background text-foreground"
    >
      {/* Behance Hero Showcase Section with Floating Cards Layout */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-border/40 bg-gradient-to-b from-[#0057ff]/6 via-background to-background">
        {/* Soft Background Accent Glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#0057ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#0057ff]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-4 min-h-[460px]">
            {/* Left Floating Visual Collage (3 Columns on desktop) */}
            <div className="hidden lg:grid grid-cols-2 gap-3.5 col-span-3 items-center">
              <div className="space-y-3.5 -mt-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80"
                    alt="Editorial publication"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80"
                    alt="Ceramic craft design"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80"
                    alt="Brand packaging design"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              </div>

              <div className="space-y-3.5 mt-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="rounded-2xl overflow-hidden aspect-[4/3] border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80"
                    alt="Ocean aerial texture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80"
                    alt="Futuristic neon vector character"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80"
                    alt="Modern architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              </div>
            </div>

            {/* Center Hero Typography & Call-To-Action (6 Columns on desktop) */}
            <div className="col-span-1 lg:col-span-6 flex flex-col items-center text-center px-2 sm:px-6 space-y-5">
              {/* Main Headline (Behance Style) */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-4xl sm:text-6xl lg:text-[68px] font-display font-extrabold text-foreground tracking-tight leading-[1.08]"
              >
                The World’s <br />
                <span className="text-[#0057ff] dark:text-[#2f70ff]">
                  Best Creators
                </span> <br />
                Are On Azaiza
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed"
              >
                A comprehensive platform to help hirers and creators navigate the creative world from discovering inspiration, to connecting with one another
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="pt-2 flex flex-wrap items-center justify-center gap-3"
              >
                <Link
                  to="/creators"
                  className="px-6 sm:px-7 py-3 rounded-full bg-[#0057ff] hover:bg-[#004cdb] text-white font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(0,87,255,0.35)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Users size={15} />
                  <span>Hire a Freelancer</span>
                </Link>

                <Link
                  to={user ? "/dashboard/new" : "/signup"}
                  className="px-6 sm:px-7 py-3 rounded-full border border-border bg-card hover:bg-muted text-foreground font-bold text-xs sm:text-sm shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={15} className="text-[#0057ff]" />
                  <span>Share Your Work</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Floating Visual Collage (3 Columns on desktop) */}
            <div className="hidden lg:grid grid-cols-2 gap-3.5 col-span-3 items-center">
              <div className="space-y-3.5 -mt-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
                    alt="Pastel alpine mountain landscape"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.22 }}
                  className="rounded-2xl overflow-hidden aspect-[4/3] border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80"
                    alt="3D typography 2024 art"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.32 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80"
                    alt="Monolithic skyscraper"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              </div>

              <div className="space-y-3.5 mt-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80"
                    alt="Kinetic abstract poster"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.28 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80"
                    alt="Retro gaming and tech isometric"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.38 }}
                  className="rounded-2xl overflow-hidden aspect-square border border-border/60 bg-card shadow-sm hover:scale-105 hover:shadow-md transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80"
                    alt="Isometric urban design architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Behance Filter & Unified Search Ribbon (Matching Exact Screenshot) */}
      <section className="sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border py-3 shadow-xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Filter Toggle Pill Button */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
                filtersOpen || activeFilterCount > 0
                  ? "border-[#0057ff] bg-[#0057ff]/10 text-[#0057ff]"
                  : "border-border bg-card hover:bg-muted text-foreground"
              }`}
            >
              <SlidersHorizontal size={14} className="text-[#0057ff]" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0057ff] text-white text-[10px] flex items-center justify-center font-mono font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Center Pill Search Input with Internal Tabs */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center px-4 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted/60 focus-within:bg-card focus-within:border-[#0057ff] focus-within:ring-2 focus-within:ring-[#0057ff]/20 transition-all shadow-inner"
            >
              <Search size={15} className="text-muted-foreground mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Azaiza masterworks, creators, 3D, Figma..."
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              {/* Inside Pill Tabs: Projects | People | Assets | Images */}
              <div className="hidden md:flex items-center gap-1 pl-2 border-l border-border shrink-0 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setSearchTab("projects")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    searchTab === "projects"
                      ? "bg-card text-foreground shadow-xs font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Projects
                </button>

                <button
                  type="button"
                  onClick={() => setSearchTab("people")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    searchTab === "people"
                      ? "bg-card text-foreground shadow-xs font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  People
                </button>

                <button
                  type="button"
                  onClick={() => setSearchTab("assets")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    searchTab === "assets"
                      ? "bg-card text-foreground shadow-xs font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Assets
                </button>

                <button
                  type="button"
                  onClick={() => setSearchTab("images")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    searchTab === "images"
                      ? "bg-card text-foreground shadow-xs font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Images
                </button>
              </div>
            </form>

            {/* Right Sort Dropdown */}
            <div className="relative shrink-0 hidden sm:block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort projects"
                className="appearance-none px-4 py-2.5 pr-8 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="featured">Recommended ▾</option>
                <option value="most-appreciated">Most Appreciated</option>
                <option value="most-viewed">Most Viewed</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Expandable Category and Software Filter Bar */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-3 overflow-hidden"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Main Behance Discovery Feed Stage */}
      <section className="pt-6 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Feed Switcher Row */}
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-6">
            {/* For You Tab */}
            <button
              onClick={() => handleFeedChange("for-you")}
              className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all relative cursor-pointer ${
                activeFeed === "for-you"
                  ? "text-[#0057ff]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass size={14} />
              <span>{t("feed.forYou", "For You (Curated Discovery)")}</span>
              {activeFeed === "for-you" && (
                <motion.span
                  layoutId="feedUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0057ff]"
                />
              )}
            </button>

            {/* Following Tab */}
            <button
              onClick={() => handleFeedChange("following")}
              className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all relative cursor-pointer ${
                activeFeed === "following"
                  ? "text-[#0057ff]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck size={14} />
              <span>{t("feed.following", "Following Feed")}</span>
              {activeFeed === "following" && (
                <motion.span
                  layoutId="feedUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0057ff]"
                />
              )}
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-mono text-muted-foreground">
            Showing <strong className="text-foreground">{displayedFeedProjects.length}</strong> masterworks
          </span>
        </div>

        {/* Discovery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-7">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="space-y-2.5">
                <div className="aspect-[4/3] rounded-xl bg-muted/40 animate-pulse border border-border" />
                <div className="h-4 bg-muted/40 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : displayedFeedProjects.length === 0 ? (
          activeFeed === "following" ? (
            <div className="py-20 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0057ff]/10 text-[#0057ff] flex items-center justify-center mx-auto">
                <Users size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  {t("feed.emptyFollowing", "Your Following Feed is Empty")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(
                    "feed.emptyFollowingDesc",
                    "You haven't followed any creators yet. Follow leading designers to see their latest published masterworks right here!"
                  )}
                </p>
              </div>
              <Link
                to="/creators"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0057ff] text-white text-xs font-bold shadow-md hover:bg-[#004cdb] cursor-pointer"
              >
                <Users size={14} />
                <span>{t("feed.exploreCreators", "Explore & Follow Creators")}</span>
              </Link>
            </div>
          ) : (
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
                className="px-4 py-2 rounded-full bg-[#0057ff] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-7">
            {displayedFeedProjects.map((project, idx) => (
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
      </section>
    </motion.main>
  );
}
