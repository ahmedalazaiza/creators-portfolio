import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  Check,
  RotateCcw,
  Layers,
  Box,
  Camera,
  PenTool,
  Building,
  Cpu,
  Layout,
  Wrench,
  Clock,
  ArrowUpDown,
  Tag,
  Eye,
  Heart,
  Calendar,
  Compass,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { CATEGORIES, POPULAR_TOOLS, TIMEFRAMES, SORT_OPTIONS } from "../data/categories";
import { SortOption } from "../types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles size={16} />,
  Layout: <Layout size={16} />,
  Layers: <Layers size={16} />,
  Camera: <Camera size={16} />,
  Box: <Box size={16} />,
  PenTool: <PenTool size={16} />,
  Building: <Building size={16} />,
  Cpu: <Cpu size={16} />,
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
  initialSubCategory?: string;
  initialTool?: string;
  initialSort?: SortOption;
  initialTimeframe?: string;
  onApplyFilters?: (filters: {
    searchQuery: string;
    category: string;
    subCategory: string;
    tool: string;
    sortBy: SortOption;
    timeframe: string;
  }) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  initialQuery = "",
  initialCategory = "all",
  initialSubCategory = "all",
  initialTool = "",
  initialSort = "featured",
  initialTimeframe = "all",
  onApplyFilters,
}: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
  const [selectedTool, setSelectedTool] = useState(initialTool);
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSort);
  const [selectedTimeframe, setSelectedTimeframe] = useState(initialTimeframe);
  const [activeTab, setActiveTab] = useState<"search" | "filters">("search");

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all projects for live result preview count
  const { allProjects } = useProjects();

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedCategory(initialCategory);
      setSelectedSubCategory(initialSubCategory);
      setSelectedTool(initialTool);
      setSelectedSort(initialSort);
      setSelectedTimeframe(initialTimeframe);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, initialQuery, initialCategory, initialSubCategory, initialTool, initialSort, initialTimeframe]);

  // Global keybinding Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Active category object & its subcategories
  const currentCategoryObj = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === selectedCategory) || CATEGORIES[0];
  }, [selectedCategory]);

  // Calculate live matching projects count
  const matchingProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Status
      if (p.status === "draft") return false;

      // Category match
      if (selectedCategory && selectedCategory !== "all") {
        const catSlug = selectedCategory.toLowerCase();
        const matchesCat =
          p.categoryId?.toLowerCase() === catSlug ||
          p.category.toLowerCase().includes(catSlug) ||
          catSlug.includes(p.category.toLowerCase().replace(/[^a-z0-9]/g, "-"));
        if (!matchesCat) return false;
      }

      // SubCategory match
      if (selectedSubCategory && selectedSubCategory !== "all") {
        const subSlug = selectedSubCategory.toLowerCase();
        const matchesSub =
          p.tags?.some((t) => t.toLowerCase().includes(subSlug)) ||
          p.title.toLowerCase().includes(subSlug) ||
          p.description.toLowerCase().includes(subSlug) ||
          p.tools?.some((t) => t.toLowerCase().includes(subSlug));
        if (!matchesSub) return false;
      }

      // Tool match
      if (selectedTool && selectedTool.trim()) {
        const matchesTool = p.tools?.some((t) =>
          t.toLowerCase().includes(selectedTool.toLowerCase())
        );
        if (!matchesTool) return false;
      }

      // Search Query match
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesQuery =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.creator.fullName.toLowerCase().includes(q) ||
          p.creator.username.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.tools?.some((t) => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [allProjects, selectedCategory, selectedSubCategory, selectedTool, query]);

  // Count active filter pills
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (query.trim()) count++;
    if (selectedCategory && selectedCategory !== "all") count++;
    if (selectedSubCategory && selectedSubCategory !== "all") count++;
    if (selectedTool) count++;
    if (selectedSort !== "featured") count++;
    if (selectedTimeframe !== "all") count++;
    return count;
  }, [query, selectedCategory, selectedSubCategory, selectedTool, selectedSort, selectedTimeframe]);

  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setSelectedTool("");
    setSelectedSort("featured");
    setSelectedTimeframe("all");
  };

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onApplyFilters) {
      onApplyFilters({
        searchQuery: query,
        category: selectedCategory,
        subCategory: selectedSubCategory,
        tool: selectedTool,
        sortBy: selectedSort,
        timeframe: selectedTimeframe,
      });
    } else {
      // Build search params and navigate
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedSubCategory !== "all") params.set("sub", selectedSubCategory);
      if (selectedTool) params.set("tool", selectedTool);
      if (selectedSort !== "featured") params.set("sort", selectedSort);
      if (selectedTimeframe !== "all") params.set("time", selectedTimeframe);

      navigate({
        pathname: "/",
        search: params.toString() ? `?${params.toString()}` : "",
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl shadow-slate-900/20 dark:shadow-black/70 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header Search Field */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070905]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md shadow-[#CDF22B]/20">
                <Search size={18} />
              </div>

              <div className="flex-1 relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Search projects by title, creator, tags, keywords..."
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm sm:text-base font-medium focus:outline-none pr-8"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-slate-200/60 dark:bg-[#1e231b] border border-transparent dark:border-white/10 hover:bg-slate-300 dark:hover:bg-[#2E3823] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Tabs: All Filters vs Quick Mode */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("search")}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "search"
                      ? "bg-slate-900 text-[#CDF22B] dark:bg-[#1e231b] dark:text-[#CDF22B] border border-slate-900 dark:border-white/10 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <SlidersHorizontal size={13} />
                  <span>Interactive Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#CDF22B] text-slate-900 font-bold text-[10px] flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="text-[11px] font-mono text-muted-foreground">
                Matching: <strong className="text-foreground">{matchingProjects.length}</strong> works
              </div>
            </div>
          </div>

          {/* Scrollable Filters Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
            {/* 1. Sort By Section */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                <ArrowUpDown size={15} className="text-slate-900 dark:text-white" />
                <span>Sort Projects (الترتيب)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = selectedSort === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedSort(opt.value)}
                      className={`p-2.5 rounded-2xl border text-left font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#CDF22B]/20 border-slate-900 dark:border-[#CDF22B] text-foreground font-bold shadow-xs"
                          : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#1e231b]/60 text-muted-foreground hover:text-foreground hover:border-slate-300"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check size={14} className="text-slate-950 dark:text-[#CDF22B] shrink-0 ml-1 font-bold" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Main Categories Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                  <Layers size={15} className="text-slate-900 dark:text-white" />
                  <span>Creative Discipline (التصنيف الرئيسي)</span>
                </div>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedSubCategory("all");
                    }}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                  >
                    Clear Category
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  const icon = CATEGORY_ICONS[cat.icon || "Sparkles"] || <Sparkles size={16} />;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSelectedSubCategory("all");
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 dark:bg-[#1e231b] text-white border-slate-900 dark:border-[#CDF22B] shadow-md ring-1 ring-slate-900 dark:ring-[#CDF22B]"
                          : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#1e231b]/50 text-foreground hover:border-slate-400 hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#CDF22B] text-slate-950 shadow-xs"
                            : "bg-slate-100 dark:bg-[#171915] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-bold text-xs truncate ${isSelected ? "text-white dark:text-[#CDF22B]" : "text-foreground"}`}>{cat.name}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? "text-slate-300 dark:text-slate-300 font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {cat.subCategories?.length || 0} sub-fields
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Sub-Categories Section (appears if category selected) */}
            {currentCategoryObj.subCategories && currentCategoryObj.subCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2.5 p-4 rounded-2xl bg-slate-100/70 dark:bg-[#1e231b]/80 border border-slate-200/80 dark:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-foreground text-xs">
                    <Compass size={15} className="text-slate-900 dark:text-white" />
                    <span>Specialized Sub-fields for {currentCategoryObj.name}</span>
                  </div>
                  {selectedSubCategory !== "all" && (
                    <button
                      onClick={() => setSelectedSubCategory("all")}
                      className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Reset Sub-field
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSubCategory("all")}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                      selectedSubCategory === "all"
                        ? "bg-[#CDF22B] text-slate-950 font-bold shadow-xs"
                        : "bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All Sub-fields
                  </button>
                  {currentCategoryObj.subCategories.map((sub) => {
                    const isSubSelected = selectedSubCategory === sub.slug;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubCategory(sub.slug)}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSubSelected
                            ? "bg-[#CDF22B] text-slate-950 font-bold shadow-xs"
                            : "bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-slate-400"
                        }`}
                      >
                        <span>{sub.name}</span>
                        {isSubSelected && <Check size={12} className="text-slate-950" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 4. Software & Tools Used */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                  <Wrench size={15} className="text-slate-900 dark:text-white" />
                  <span>Software & Creative Tools (البرامج المستخدمة)</span>
                </div>
                {selectedTool && (
                  <button
                    onClick={() => setSelectedTool("")}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                  >
                    Clear Tool
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {POPULAR_TOOLS.map((tool) => {
                  const isToolActive = selectedTool.toLowerCase() === tool.toLowerCase();
                  return (
                    <button
                      key={tool}
                      onClick={() => setSelectedTool(isToolActive ? "" : tool)}
                      className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isToolActive
                          ? "bg-[#CDF22B] text-slate-950 border-slate-900 dark:border-[#CDF22B] shadow-xs"
                          : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#1e231b]/60 text-muted-foreground hover:text-foreground hover:border-slate-300"
                      }`}
                    >
                      <span>{tool}</span>
                      {isToolActive && <Check size={12} className="text-slate-950" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Timeframe Filter */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                <Calendar size={15} className="text-slate-900 dark:text-white" />
                <span>Time Period (الفترة الزمنية)</span>
              </div>
              <div className="flex items-center gap-2">
                {TIMEFRAMES.map((tf) => {
                  const isTfSelected = selectedTimeframe === tf.value;
                  return (
                    <button
                      key={tf.value}
                      onClick={() => setSelectedTimeframe(tf.value)}
                      className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isTfSelected
                          ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 border-slate-900 dark:border-[#CDF22B] font-bold shadow-xs"
                          : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#1e231b]/60 text-muted-foreground hover:text-foreground hover:border-slate-300"
                      }`}
                    >
                      <span>{tf.label}</span>
                      {isTfSelected && <Check size={13} className="text-[#CDF22B] dark:text-slate-950" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#070905] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleResetFilters}
              disabled={activeFiltersCount === 0}
              className="px-4 py-2.5 rounded-full btn-secondary text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw size={13} />
              <span>Reset All ({activeFiltersCount})</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-full btn-secondary text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => handleApply()}
                className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <span>Apply & Show ({matchingProjects.length} Projects)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
