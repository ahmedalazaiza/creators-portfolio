import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
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
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { CATEGORIES, POPULAR_TOOLS, TIMEFRAMES, SORT_OPTIONS } from "../data/categories";
import { SortOption } from "../types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles size={15} />,
  Layout: <Layout size={15} />,
  Layers: <Layers size={15} />,
  Camera: <Camera size={15} />,
  Box: <Box size={15} />,
  PenTool: <PenTool size={15} />,
  Building: <Building size={15} />,
  Cpu: <Cpu size={15} />,
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
    subCategory?: string;
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
  initialTool = "all",
  initialSort = "featured",
  initialTimeframe = "all-time",
  onApplyFilters,
}: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTool, setSelectedTool] = useState(initialTool);
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSort);
  const [selectedTimeframe, setSelectedTimeframe] = useState(initialTimeframe);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { allProjects } = useProjects();

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedCategory(initialCategory);
      setSelectedTool(initialTool);
      setSelectedSort(initialSort);
      setSelectedTimeframe(initialTimeframe);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, initialQuery, initialCategory, initialTool, initialSort, initialTimeframe]);

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

  // Calculate live matching projects count
  const matchingProjects = useMemo(() => {
    return allProjects.filter((p) => {
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
  }, [allProjects, selectedCategory, selectedTool, query]);

  // Count active filter pills
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (query.trim()) count++;
    if (selectedCategory && selectedCategory !== "all") count++;
    if (selectedTool) count++;
    if (selectedSort !== "featured") count++;
    if (selectedTimeframe !== "all") count++;
    return count;
  }, [query, selectedCategory, selectedTool, selectedSort, selectedTimeframe]);

  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategory("all");
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
        tool: selectedTool,
        sortBy: selectedSort,
        timeframe: selectedTimeframe,
      });
    } else {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedTool) params.set("tool", selectedTool);
      if (selectedSort !== "featured") params.set("sort", selectedSort);
      if (selectedTimeframe !== "all") params.set("time", selectedTimeframe);

      navigate({
        pathname: "/search",
        search: params.toString() ? `?${params.toString()}` : "",
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
          />

          {/* Modal / Bottom Sheet Box */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full sm:max-w-2xl bg-white dark:bg-[#151813] border-t sm:border border-slate-300 dark:border-white/15 rounded-t-[32px] sm:rounded-[32px] overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh] shadow-2xl pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] sm:pb-0"
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-3 mb-1 sm:hidden shrink-0" />

            {/* Header: Clean Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#11130e]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                  <Search size={17} />
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Search projects, creators, tools..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm sm:text-base font-medium focus:outline-none min-h-[44px]"
                />

                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Options */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs no-scrollbar">
              {/* 1. Sort Section */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                  <ArrowUpDown size={14} className="text-slate-900 dark:text-[#CDF22B]" />
                  <span>Sort by</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = selectedSort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedSort(opt.value)}
                        className={`px-3 py-2 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-[#CDF22B] text-slate-950 border-[#CDF22B] font-bold"
                            : "border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-slate-300"
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && <Check size={13} className="text-slate-950 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Creative Disciplines (Clean Wrap Pills with Full Text) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                    <Layers size={14} className="text-slate-900 dark:text-[#CDF22B]" />
                    <span>Creative Discipline</span>
                  </div>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.slug;
                    const icon = CATEGORY_ICONS[cat.icon || "Sparkles"] || <Sparkles size={14} />;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`px-3.5 py-2 rounded-2xl border text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? "bg-[#CDF22B] text-slate-950 border-[#CDF22B] font-bold"
                            : "border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-foreground/80 hover:text-foreground hover:border-slate-300 dark:hover:border-white/20"
                        }`}
                      >
                        <span className={isSelected ? "text-slate-950" : "text-muted-foreground"}>
                          {icon}
                        </span>
                        <span>{cat.name}</span>
                        {isSelected && <Check size={12} className="text-slate-950 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Software & Creative Tools */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                    <Wrench size={14} className="text-slate-900 dark:text-[#CDF22B]" />
                    <span>Software & Tools</span>
                  </div>
                  {selectedTool && (
                    <button
                      onClick={() => setSelectedTool("")}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TOOLS.map((tool) => {
                    const isToolActive = selectedTool.toLowerCase() === tool.toLowerCase();
                    return (
                      <button
                        key={tool}
                        onClick={() => setSelectedTool(isToolActive ? "" : tool)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isToolActive
                            ? "bg-[#CDF22B] text-slate-950 border-[#CDF22B] font-bold"
                            : "border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-slate-300"
                        }`}
                      >
                        <span>{tool}</span>
                        {isToolActive && <Check size={11} className="text-slate-950" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Time Period */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                  <Calendar size={14} className="text-slate-900 dark:text-[#CDF22B]" />
                  <span>Time Period</span>
                </div>
                <div className="flex items-center gap-2">
                  {TIMEFRAMES.map((tf) => {
                    const isTfSelected = selectedTimeframe === tf.value;
                    return (
                      <button
                        key={tf.value}
                        onClick={() => setSelectedTimeframe(tf.value)}
                        className={`px-3.5 py-1.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isTfSelected
                            ? "bg-[#CDF22B] text-slate-950 border-[#CDF22B] font-bold"
                            : "border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-slate-300"
                        }`}
                      >
                        <span>{tf.label}</span>
                        {isTfSelected && <Check size={12} className="text-slate-950" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#11130e] flex items-center justify-between gap-2 sm:gap-3">
              <button
                onClick={handleResetFilters}
                disabled={activeFiltersCount === 0}
                className="min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="min-h-[44px] px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-foreground transition-colors cursor-pointer active:scale-95"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleApply()}
                  className="min-h-[44px] px-5 py-2 rounded-full btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <span>Show {matchingProjects.length} Projects</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

