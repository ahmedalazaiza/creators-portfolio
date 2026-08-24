import React, { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  Box,
  Camera,
  PenTool,
  Building,
  Cpu,
  Layout,
} from "lucide-react";
import { Project, Category } from "../types";
import ProjectCard from "./ProjectCard";

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

interface CategorySectionSliderProps {
  category: Category;
  projects: Project[];
  onExploreCategory: (slug: string) => void;
}

export default function CategorySectionSlider({
  category,
  projects,
  onExploreCategory,
}: CategorySectionSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (projects.length === 0) return null;

  const icon = CATEGORY_ICONS[category.icon || "Sparkles"] || <Sparkles size={16} />;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="space-y-4 py-4">
      {/* Category Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#CDF22B]/25 font-bold">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                {category.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-muted-foreground">
                {projects.length} Works
              </span>
            </div>
            {category.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Controls: Prev/Next Arrows & Explore More Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Slider Prev/Next Controls */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous projects"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-all cursor-pointer shadow-2xs active:scale-90"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next projects"
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-all cursor-pointer shadow-2xs active:scale-90"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Explore More Button */}
          <button
            onClick={() => onExploreCategory(category.slug)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#CDF22B] hover:text-slate-900 text-xs font-bold text-foreground transition-all cursor-pointer group shadow-2xs"
          >
            <span>Explore All {category.name.split(" ")[0]}</span>
            <ArrowRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>

      {/* Free Full-Bleed Horizontal Slider Track (No margin lock, edge to edge, no scrollbars) */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className={`flex items-stretch gap-5 overflow-x-auto overflow-y-hidden no-scrollbar py-3 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 select-none ${
          isDragging ? "cursor-grabbing scroll-auto" : "cursor-grab scroll-smooth"
        }`}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 flex flex-col pointer-events-auto"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
