import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, Heart, Bookmark, ThumbsUp } from "lucide-react";
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
  const { toggleAppreciation } = useProjects();

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
        className="group flex flex-col space-y-2 transition-all duration-200"
      >
        {/* Behance Project Card Thumbnail Canvas */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted/40 border border-border/60 group-hover:border-[#0057ff]/40 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all">
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
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 p-3 flex flex-col justify-between transition-opacity duration-200 pointer-events-none ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Top Row: Save Button */}
            <div className="flex items-center justify-end pointer-events-auto">
              <button
                onClick={handleSave}
                aria-label="Save to Moodboard"
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                  project.isSaved
                    ? "bg-[#0057ff] text-white"
                    : "bg-black/60 hover:bg-black/80 text-white"
                }`}
              >
                <Bookmark
                  size={14}
                  className={project.isSaved ? "fill-white" : ""}
                />
              </button>
            </div>

            {/* Bottom Row: Quick Appreciate Action */}
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="text-white text-xs font-bold truncate max-w-[70%] drop-shadow-sm">
                {project.title}
              </span>
              <button
                onClick={handleLike}
                aria-label="Appreciate"
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                  project.isAppreciated
                    ? "bg-rose-500 text-white"
                    : "bg-black/60 hover:bg-black/80 text-white hover:text-rose-400"
                }`}
              >
                <Heart
                  size={14}
                  className={project.isAppreciated ? "fill-white" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Behance Exact Project Card Footer Meta */}
        <div className="space-y-0.5 pt-0.5">
          {/* Row 1: Title (left) & Appreciations / Views (right) */}
          <div className="flex items-center justify-between gap-2">
            <Link
              to={projectUrl}
              className="text-[13px] font-bold text-foreground hover:text-[#0057ff] transition-colors truncate font-sans block flex-1"
              title={project.title}
            >
              {project.title}
            </Link>

            <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono shrink-0 font-medium">
              <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                <ThumbsUp size={11} className={project.isAppreciated ? "text-[#0057ff] fill-[#0057ff]" : ""} />
                <span>{project.appreciationsCount || 0}</span>
              </span>
              <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Eye size={11} />
                <span>{project.viewsCount || 0}</span>
              </span>
            </div>
          </div>

          {/* Row 2: Creator Name & PRO Badge */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleCreatorClick}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs truncate text-left cursor-pointer group/creator"
            >
              <span className="truncate group-hover/creator:underline">
                {creator.fullName}
              </span>
              <span className="px-1.5 py-0.2 rounded-xs bg-[#0057ff] text-white text-[9px] font-mono font-bold uppercase tracking-wider shrink-0">
                PRO
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Save to Collection Modal */}
      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        project={project}
      />
    </>
  );
}
