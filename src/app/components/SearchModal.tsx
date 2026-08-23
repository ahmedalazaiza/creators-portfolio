import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowUpRight, Sparkles, User, Tag } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { MOCK_CREATORS } from "../data/mockData";
import { CATEGORIES } from "../data/categories";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { allProjects } = useProjects();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Global keybinding Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled externally or we can toggle
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedProjects = q
    ? allProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tools.some((t) => t.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  const matchedCreators = q
    ? MOCK_CREATORS.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.username.toLowerCase().includes(q) ||
          c.skills?.some((s) => s.toLowerCase().includes(q))
      ).slice(0, 3)
    : [];

  const matchedCategories = q
    ? CATEGORIES.filter(
        (c) =>
          c.slug !== "all" &&
          (c.name.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q))
      ).slice(0, 3)
    : [];

  const handleSelectProject = (slug: string) => {
    onClose();
    navigate(`/project/${slug}`);
  };

  const handleSelectCreator = (username: string) => {
    onClose();
    navigate(`/@${username}`);
  };

  const handleSelectCategory = (slug: string) => {
    onClose();
    navigate(`/?category=${slug}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Search Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <Search size={20} className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search masterworks, tools (Figma, Blender), creators, fields..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X size={16} />
              </button>
            )}
            <kbd className="hidden sm:inline-block font-mono text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground border border-border">
              ESC
            </kbd>
          </div>

          {/* Results or Suggestions */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
            {q === "" ? (
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  <Sparkles size={14} className="text-primary" /> Popular Creative Fields
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.slug)}
                      className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/10 hover:bg-primary/10 hover:border-primary/40 text-left text-xs font-medium text-foreground transition-all group"
                    >
                      <span className="truncate">{cat.name}</span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  <Tag size={14} /> Trending Tags & Tools
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Figma", "Blender", "Design System", "Octane Render", "Brutalism", "Typography", "RTL Design", "Architectural"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Matched Creators */}
                {matchedCreators.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                      <User size={14} /> Creators
                    </div>
                    <div className="space-y-1.5">
                      {matchedCreators.map((creator) => (
                        <button
                          key={creator.id}
                          onClick={() => handleSelectCreator(creator.username)}
                          className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-muted/40 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={creator.avatarUrl}
                              alt={creator.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-border"
                            />
                            <div>
                              <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {creator.fullName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                @{creator.username} · {creator.location}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-primary opacity-0 group-hover:opacity-100 font-mono transition-opacity">
                            View Profile →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Projects */}
                {matchedProjects.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                      <Sparkles size={14} /> Projects
                    </div>
                    <div className="space-y-2">
                      {matchedProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => handleSelectProject(project.slug)}
                          className="w-full flex items-center gap-4 p-2.5 rounded-2xl hover:bg-muted/40 transition-colors text-left group"
                        >
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-16 h-12 rounded-xl object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {project.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              by {project.creator.fullName} in {project.category}
                            </div>
                          </div>
                          <ArrowUpRight
                            size={16}
                            className="text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {matchedProjects.length === 0 &&
                  matchedCreators.length === 0 &&
                  matchedCategories.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <p className="text-sm mb-2 font-display font-medium text-foreground">
                        No matches found for "{query}"
                      </p>
                      <p className="text-xs">
                        Try searching by field, software tool, or creator name.
                      </p>
                    </div>
                  )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
