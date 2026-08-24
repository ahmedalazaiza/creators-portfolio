import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  Box,
  Camera,
  PenTool,
  Building,
  Cpu,
  Layout,
  ArrowRight,
  Compass,
} from "lucide-react";
import { CATEGORIES } from "../data/categories";

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

interface CategoryNavMenuProps {
  onCategorySelect?: (categorySlug: string, subCategorySlug?: string) => void;
}

export default function CategoryNavMenu({ onCategorySelect }: CategoryNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategorySlug, setHoveredCategorySlug] = useState<string>("ui-ux");
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCategory =
    CATEGORIES.find((c) => c.slug === hoveredCategorySlug) ||
    CATEGORIES.find((c) => c.slug !== "all") ||
    CATEGORIES[1];

  const handleNavigate = (categorySlug: string, subCategorySlug?: string) => {
    setIsOpen(false);
    if (onCategorySelect) {
      onCategorySelect(categorySlug, subCategorySlug);
    } else {
      const params = new URLSearchParams();
      if (categorySlug && categorySlug !== "all") params.set("category", categorySlug);
      if (subCategorySlug && subCategorySlug !== "all") params.set("sub", subCategorySlug);
      navigate({
        pathname: "/",
        search: params.toString() ? `?${params.toString()}` : "",
      });
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
          isOpen
            ? "bg-slate-900 text-white dark:bg-slate-800 dark:text-white"
            : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <Compass size={14} className={isOpen ? "text-[#CDF22B]" : "text-foreground"} />
        <span>Categories</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* 100% Solid Opaque Mega Dropdown (Zero background bleedthrough) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute left-0 mt-2 w-[540px] sm:w-[620px] rounded-3xl bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-900/20 dark:shadow-black/70 z-50 overflow-hidden text-xs"
          >
            {/* Header Bar */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#171915] flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <div className="w-5 h-5 rounded-lg bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles size={11} />
                </div>
                <span>Explore Creative Disciplines</span>
              </div>
              <button
                onClick={() => handleNavigate("all")}
                className="text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Browse All</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* 2-Column Split Layout */}
            <div className="grid grid-cols-12 divide-x divide-slate-200 dark:divide-white/10 min-h-[310px]">
              {/* Left Column: Categories List */}
              <div className="col-span-5 p-2.5 space-y-1 max-h-[350px] overflow-y-auto bg-slate-50/50 dark:bg-[#171915]">
                {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
                  const isHovered = (activeCategory?.slug || "ui-ux") === cat.slug;
                  const icon = CATEGORY_ICONS[cat.icon || "Sparkles"] || <Sparkles size={14} />;
                  return (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setHoveredCategorySlug(cat.slug)}
                      onClick={() => handleNavigate(cat.slug)}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl transition-all flex items-center justify-between group cursor-pointer ${
                        isHovered
                          ? "bg-slate-900 text-white dark:bg-[#CDF22B] dark:text-slate-950 font-bold shadow-md"
                          : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isHovered
                              ? "bg-[#CDF22B] text-slate-950 dark:bg-slate-950 dark:text-[#CDF22B] font-bold"
                              : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {icon}
                        </div>
                        <span className="truncate text-xs">{cat.name}</span>
                      </div>
                      <ChevronRight
                        size={13}
                        className={`shrink-0 transition-transform ${
                          isHovered ? "translate-x-0.5 opacity-100" : "opacity-40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Subcategories & View All */}
              <div className="col-span-7 p-4 bg-white dark:bg-[#070905] flex flex-col justify-between">
                <div>
                  {/* Category Sub-Header */}
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="min-w-0 pr-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {activeCategory.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {activeCategory.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigate(activeCategory.slug)}
                      className="px-3 py-1 rounded-full bg-[#CDF22B] text-slate-950 font-bold text-[11px] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
                    >
                      View All
                    </button>
                  </div>

                  {/* Sub-categories List */}
                  <div className="space-y-1">
                    {activeCategory.subCategories?.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleNavigate(activeCategory.slug, sub.slug)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group cursor-pointer"
                      >
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-[#CDF22B] flex items-center justify-between">
                          <span>{sub.name}</span>
                          <ArrowRight
                            size={12}
                            className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-slate-950 dark:text-[#CDF22B]"
                          />
                        </div>
                        {sub.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {sub.description}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Insight */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between font-medium">
                  <span className="text-slate-500 dark:text-slate-400">
                    {activeCategory.projectCount || 10}+ curated works
                  </span>
                  <button
                    onClick={() => handleNavigate(activeCategory.slug)}
                    className="font-bold text-slate-900 dark:text-[#CDF22B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore All Works</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
