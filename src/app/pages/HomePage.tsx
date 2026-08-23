import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Users,
  Eye,
  Heart,
  Plus,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Award,
  ThumbsUp,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useCreator } from "../hooks/useCreator";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "../components/ProjectCard";
import { SortOption, FeedType } from "../types";

// Category Badges with Image Thumbnails (Matching Screenshot 1)
const CATEGORY_BADGES = [
  {
    id: "for-you",
    slug: "for-you",
    name: "For You",
    icon: "⭐",
    bgImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80",
    isFeed: true,
  },
  {
    id: "following",
    slug: "following",
    name: "Following",
    icon: "🤍",
    bgImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80",
    isFeed: true,
  },
  {
    id: "best-of",
    slug: "all",
    name: "Best of Azaiza",
    icon: "🏆",
    bgImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "graphic-design",
    slug: "branding",
    name: "Graphic Design",
    bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "photography",
    slug: "photography",
    name: "Photography",
    bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "illustration",
    slug: "illustration",
    name: "Illustration",
    bgImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "3d-art",
    slug: "3d-motion",
    name: "3D Art",
    bgImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "ui-ux",
    slug: "ui-ux",
    name: "UI/UX",
    bgImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "motion",
    slug: "3d-motion",
    name: "Motion",
    bgImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "architecture",
    slug: "architecture",
    name: "Architecture",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "product-design",
    slug: "product-design",
    name: "Product Design",
    bgImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "fashion",
    slug: "fashion",
    name: "Fashion",
    bgImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80",
  },
];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const feedParam = (searchParams.get("feed") as FeedType) || "for-you";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [activeFeed, setActiveFeed] = useState<FeedType>(feedParam);
  const [activeBadgeId, setActiveBadgeId] = useState<string>("for-you");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchTab, setSearchTab] = useState<"projects" | "people" | "assets" | "images">("projects");

  const { user } = useAuth();
  const { allCreators } = useCreator();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const badgesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setActiveFeed(feedParam);
  }, [feedParam]);

  const handleBadgeClick = (badge: typeof CATEGORY_BADGES[0]) => {
    setActiveBadgeId(badge.id);
    if (badge.isFeed) {
      setActiveFeed(badge.slug as FeedType);
      setActiveCategory("all");
      setSearchParams({ feed: badge.slug });
    } else {
      setActiveCategory(badge.slug);
      setActiveFeed("for-you");
      if (badge.slug === "all") {
        searchParams.delete("category");
        searchParams.delete("feed");
        setSearchParams(searchParams);
      } else {
        setSearchParams({ category: badge.slug });
      }
    }
  };

  const scrollBadges = (dir: "left" | "right") => {
    if (badgesScrollRef.current) {
      badgesScrollRef.current.scrollBy({
        left: dir === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === "people") {
      navigate(`/creators?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${activeCategory}`);
    }
  };

  const { projects, loading } = useProjects({
    category: activeCategory,
    searchQuery,
    sortBy,
  });

  // Following Feed Filter
  const displayedProjects = useMemo(() => {
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
      className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background text-foreground"
    >
      {/* Behance Unified Search & Filter Header Ribbon (Screenshot 1) */}
      <div className="border-b border-border bg-background sticky top-14 sm:top-16 z-30 py-3 shadow-2xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Filter Toggle Pill Button */}
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveFeed("for-you");
                setActiveBadgeId("for-you");
                searchParams.delete("category");
                searchParams.delete("feed");
                setSearchParams(searchParams);
              }}
              className="px-4 py-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <SlidersHorizontal size={14} className="text-[#0057ff]" />
              <span>Filter</span>
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
                placeholder="Search Behance..."
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

          {/* Dark Image Category Badges Carousel Row (Screenshot 1 Exact) */}
          <div className="relative flex items-center pt-1">
            <div
              ref={badgesScrollRef}
              className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 w-full scroll-smooth"
            >
              {CATEGORY_BADGES.map((badge) => {
                const isActive = activeBadgeId === badge.id;
                return (
                  <button
                    key={badge.id}
                    onClick={() => handleBadgeClick(badge)}
                    className={`relative shrink-0 h-10 px-4 rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs group ${
                      isActive
                        ? "border-[#0057ff] ring-2 ring-[#0057ff]/40 shadow-sm"
                        : "border-border/80 hover:border-foreground/40"
                    }`}
                  >
                    {/* Background Dark Image with Overlay */}
                    <img
                      src={badge.bgImage}
                      alt={badge.name}
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.35] group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                    {/* Badge Content */}
                    <span className="relative z-10 text-white flex items-center gap-1.5 whitespace-nowrap drop-shadow-sm text-[12px]">
                      {badge.icon && <span>{badge.icon}</span>}
                      <span>{badge.name}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Next Arrow Button */}
            <button
              onClick={() => scrollBadges("right")}
              aria-label="Scroll categories right"
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/90 border border-border shadow-md items-center justify-center text-foreground hover:bg-muted cursor-pointer z-10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Behance Project Grid (5 columns per row on large displays) */}
      <section className="pt-6 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-7">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="space-y-2">
                <div className="aspect-[4/3] rounded-lg bg-muted/40 animate-pulse border border-border" />
                <div className="h-4 bg-muted/40 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0057ff]/10 text-[#0057ff] flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No projects found</h3>
              <p className="text-xs text-muted-foreground">
                Try selecting another category badge or clearing your search.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveFeed("for-you");
                setActiveBadgeId("for-you");
                setSearchQuery("");
                setSearchParams({});
              }}
              className="px-5 py-2.5 rounded-full bg-[#0057ff] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Reset to All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-7">
            {displayedProjects.map((project, idx) => {
              // Insert Promotional Behance Pro Card at position 3 (like in Screenshot 1)
              const showPromoCard = idx === 2;

              return (
                <React.Fragment key={project.id}>
                  {showPromoCard && (
                    <div className="flex flex-col space-y-2">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#0c142b] via-[#10204d] to-[#0057ff]/60 border border-[#0057ff]/30 p-5 flex flex-col items-center justify-between text-center shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#38bdf8] shadow-inner mt-1">
                          <Zap size={20} className="fill-[#38bdf8]" />
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-white text-sm sm:text-base font-bold tracking-tight leading-snug">
                            Boost your best work <br /> where it matters most.
                          </h4>
                        </div>

                        <Link
                          to={user ? "/dashboard" : "/signup"}
                          className="px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          Start Free Trial
                        </Link>
                      </div>

                      <div className="pt-0.5">
                        <div className="text-[13px] font-bold text-foreground truncate">
                          Do more with Azaiza Pro
                        </div>
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </section>
    </motion.main>
  );
}
