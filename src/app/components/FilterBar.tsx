import React, { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
  ArrowUpDown,
  Wrench,
  Compass,
  MapPin,
  Flame,
  Check,
} from "lucide-react";
import { CATEGORIES, POPULAR_TOOLS } from "../data/categories";
import { SortOption } from "../types";

interface FilterBarProps {
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  activeTool: string;
  onSelectTool: (tool: string) => void;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Curated & Recommended",
  appreciations: "Most Appreciated",
  views: "Most Viewed",
  newest: "Most Recent",
};

export default function FilterBar({
  activeCategory,
  onSelectCategory,
  activeTool,
  onSelectTool,
  sortBy,
  onSelectSort,
  onClearFilters,
  activeFilterCount,
}: FilterBarProps) {
  const [toolDropdownOpen, setToolDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  return (
    <div className="space-y-3.5">
      {/* Behance Top Discipline Pills Bar (Scrollable horizontally) */}
      <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden pb-1 no-scrollbar border-b border-border/40">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(205,242,43,0.25)]"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Behance Secondary Dropdowns & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left: Dropdown Filters (Tools & Disciplines) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tool / Software Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setToolDropdownOpen(!toolDropdownOpen);
                setSortDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                activeTool
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Wrench size={12} className={activeTool ? "text-primary" : ""} />
              <span>{activeTool ? `Tool: ${activeTool}` : "Tools Used"}</span>
              <ChevronDown size={13} />
            </button>

            {toolDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-48 p-1.5 rounded-2xl border border-border bg-popover shadow-2xl z-40 text-xs space-y-0.5 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    onSelectTool("");
                    setToolDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                    !activeTool
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span>All Software</span>
                  {!activeTool && <Check size={12} />}
                </button>
                {POPULAR_TOOLS.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => {
                      onSelectTool(tool);
                      setToolDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                      activeTool === tool
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{tool}</span>
                    {activeTool === tool && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Filters Badge */}
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-xs font-semibold hover:bg-destructive/20 transition-colors cursor-pointer"
            >
              <X size={12} />
              <span>Reset Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Right: Sort By Dropdown (Behance Style) */}
        <div className="relative">
          <button
            onClick={() => {
              setSortDropdownOpen(!sortDropdownOpen);
              setToolDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowUpDown size={12} className="text-primary" />
            <span>Sort: {SORT_LABELS[sortBy]}</span>
            <ChevronDown size={13} />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 p-1.5 rounded-2xl border border-border bg-popover shadow-2xl z-40 text-xs space-y-0.5">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    onSelectSort(key);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                    sortBy === key
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{SORT_LABELS[key]}</span>
                  {sortBy === key && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
