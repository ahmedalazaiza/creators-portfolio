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

  const displayProjects = projects.slice(0, 10);
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
      {/* Category Section Header: Clean One-Line Layout on Mobile & Desktop */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-4 pb-2.5 border-b border-slate-200/60 dark:border-white/10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#CDF22B]/25 font-bold">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate mt-0.5">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Controls: Prev/Next Arrows & Explore More Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Slider Prev/Next Controls (Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous projects"
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-card hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground transition-all cursor-pointer shadow-2xs active:scale-90"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next projects"
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-card hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground transition-all cursor-pointer shadow-2xs active:scale-90"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Explore More Button: Icon-only on mobile aligned in one line, full text on desktop */}
          <button
            onClick={() => onExploreCategory(category.slug)}
            aria-label={`Explore all ${category.name} projects`}
            title={`Explore all ${category.name} projects`}
            className="flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full btn-secondary text-xs font-bold transition-all cursor-pointer group shadow-2xs active:scale-90"
          >
            <span className="hidden sm:inline">Explore all</span>
            <ArrowRight
              size={15}
              className="sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>

      {/* Smooth Full-Bleed Horizontal Slider Track with CSS Scroll Snap */}
      <div
        ref={scrollContainerRef}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden no-scrollbar py-3 px-3 sm:px-6 lg:px-10 -mx-3 sm:-mx-6 lg:-mx-10 snap-x snap-mandatory scroll-smooth"
      >
        {displayProjects.map((project) => (
          <div
            key={project.id}
            className="w-[270px] sm:w-[320px] md:w-[360px] lg:w-[380px] shrink-0 flex flex-col snap-start scroll-ml-3 sm:scroll-ml-6 lg:scroll-ml-10"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
