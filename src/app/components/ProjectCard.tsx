import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowUpRight, Eye, Heart, Bookmark, Sparkles, FolderPlus } from "lucide-react";
import { Project } from "../types";
import { useProjects } from "../hooks/useProjects";
import SaveToCollectionModal from "./SaveToCollectionModal";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toggleAppreciation, toggleSave } = useProjects();

  const projectUrl = `/project/${project.slug || project.id}`;
  const creator = project.creator;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleAppreciation(project.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaveModalOpen(true);
  };

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/@${creator.username}`);
  };

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group flex flex-col space-y-2.5 transition-all duration-200"
      >
        {/* Behance Project Card Thumbnail Canvas */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted/40 border border-border/60 group-hover:border-primary/50 group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-all">
          <Link to={projectUrl} className="block w-full h-full">
            <img
              src={project.coverImage}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Behance Hover Overlay with Quick Action Buttons */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 p-3.5 flex flex-col justify-between transition-opacity duration-200 pointer-events-none ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Top Actions: Curated Pill + Save to Moodboard */}
            <div className="flex items-center justify-between w-full">
              {project.isFeatured ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-primary/40 text-primary text-[10px] font-mono font-bold">
                  <Sparkles size={11} /> Curated
                </span>
              ) : (
                <span className="text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                  {project.category}
                </span>
              )}

              {/* Save to Moodboard Button */}
              <button
                onClick={handleSave}
                className={`p-2 rounded-full backdrop-blur-md border pointer-events-auto transition-all cursor-pointer ${
                  project.isSaved
                    ? "bg-amber-500 text-white border-amber-400"
                    : "bg-black/60 hover:bg-black/90 text-white border-white/20 hover:border-white/40"
                }`}
                title="Save to Moodboard / Collection"
              >
                <Bookmark size={13} className={project.isSaved ? "fill-white" : ""} />
              </button>
            </div>

            {/* Bottom Title on Image */}
            <div className="w-full">
              <Link
                to={projectUrl}
                className="text-white text-xs sm:text-sm font-display font-bold leading-snug line-clamp-1 hover:underline pointer-events-auto"
              >
                {project.title}
              </Link>
              <div className="text-[11px] text-white/80 font-mono mt-0.5">
                by {creator.fullName}
              </div>
            </div>
          </div>
        </div>

        {/* Behance Under-Thumbnail Strip: Creator Info & Stats */}
        <div className="flex items-center justify-between gap-2 px-0.5">
          {/* Creator Info */}
          <button
            onClick={handleCreatorClick}
            className="flex items-center gap-2 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer group/author"
          >
            <div className="relative shrink-0">
              <img
                src={creator.avatarUrl}
                alt={creator.fullName}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-border"
              />
              {creator.availableForWork && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-background"
                  title="Available for freelance"
                />
              )}
            </div>
            <span className="text-xs font-semibold text-foreground group-hover/author:text-primary transition-colors truncate max-w-[130px] sm:max-w-[150px]">
              {creator.fullName}
            </span>
          </button>

          {/* Behance Metrics: Appreciations + Views */}
          <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-[11px] font-mono">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                project.isAppreciated ? "text-rose-500 font-bold" : "hover:text-rose-500"
              }`}
              title="Appreciate"
            >
              <Heart
                size={12}
                className={project.isAppreciated ? "fill-rose-500 text-rose-500" : ""}
              />
              <span>{(project.appreciationsCount || 0).toLocaleString()}</span>
            </button>

            {/* Views */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye size={12} />
              <span>{(project.viewsCount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save to Collection / Moodboard Dialog */}
      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        project={project}
      />
    </>
  );
}
