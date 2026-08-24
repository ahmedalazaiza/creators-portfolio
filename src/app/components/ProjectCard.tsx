import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, Eye, Bookmark, Sparkles, User } from "lucide-react";
import { Project } from "../types";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { toggleAppreciation, toggleSave } = useProjects();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(Boolean(project.isAppreciated));
  const [likesCount, setLikesCount] = useState(project.appreciationsCount || 0);
  const [isSaved, setIsSaved] = useState(Boolean(project.isSaved));

  // Sync state when project props update
  useEffect(() => {
    setIsLiked(Boolean(project.isAppreciated));
    setLikesCount(project.appreciationsCount || 0);
    setIsSaved(Boolean(project.isSaved));
  }, [project.isAppreciated, project.appreciationsCount, project.isSaved]);

  const handleAppreciate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => Math.max(0, prev + (nextState ? 1 : -1)));
    toggleAppreciation(project.id, user?.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const nextState = !isSaved;
    setIsSaved(nextState);
    toggleSave(project.id, user?.id);
  };

  const projectUrl = `/project/${project.slug || project.id}`;
  const creatorUsername = project.creator?.username || "creator";
  const creatorName = project.creator?.fullName || "Creator";
  const creatorAvatar =
    project.creator?.avatarUrl ||
    `https://api.dicebear.com/7.x/shapes/svg?seed=${creatorUsername}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col rounded-[28px] overflow-hidden bg-white dark:bg-[#151813] border border-slate-300 dark:border-white/15 hover:border-slate-400 dark:hover:border-[#CDF22B] transition-colors"
    >
      {/* Cover Image Container */}
      <Link to={projectUrl} className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-[#1a1d17] block">
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 rounded-full bg-black/85 dark:bg-black/90 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
            {project.category}
          </span>
        </div>

        {/* Hover Quick Appreciate & Save Overlay */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Favorite / Bookmark Button */}
          <button
            onClick={handleToggleFavorite}
            aria-label="Save to favorites"
            title={isLoggedIn ? (isSaved ? "Saved to Favorites" : "Save to Favorites") : "Sign in to save"}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isSaved
                ? "bg-[#CDF22B] text-slate-950 border border-[#CDF22B] font-bold"
                : "bg-slate-900/85 text-white hover:bg-[#CDF22B] hover:text-slate-950 border border-white/25 hover:border-[#CDF22B]"
            }`}
          >
            <Bookmark size={14} className={isSaved ? "fill-slate-950 text-slate-950" : "text-white"} />
          </button>

          {/* Like / Appreciate Button */}
          <button
            onClick={handleAppreciate}
            aria-label="Appreciate project"
            title={isLoggedIn ? "Appreciate project" : "Sign in to appreciate"}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isLiked
                ? "bg-[#CDF22B] text-slate-950 border border-[#CDF22B] font-bold"
                : "bg-slate-900/85 text-white hover:bg-[#CDF22B] hover:text-slate-950 border border-white/25 hover:border-[#CDF22B]"
            }`}
          >
            <Heart size={14} className={isLiked ? "fill-slate-950 text-slate-950" : "text-white"} />
          </button>
        </div>
      </Link>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 bg-white dark:bg-[#151813]">
        {/* Title */}
        <Link to={projectUrl} className="block group-hover:text-slate-900 dark:group-hover:text-[#CDF22B] transition-colors">
          <h3 className="text-sm font-bold font-display text-foreground line-clamp-1 leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {project.description}
          </p>
        </Link>

        {/* Creator & Metrics Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/90 dark:border-white/10 text-xs">
          {/* Creator Profile Link */}
          <Link
            to={`/@${creatorUsername}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0"
          >
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-5 h-5 rounded-full object-cover bg-slate-100 shrink-0 border border-slate-200 dark:border-white/10"
            />
            <span className="font-semibold text-foreground truncate text-[11px]">
              {creatorName}
            </span>
          </Link>

          {/* Appreciations & Views Metrics */}
          <div className="flex items-center gap-3 text-muted-foreground text-[11px] shrink-0 font-medium">
            <button
              onClick={handleAppreciate}
              className={`flex items-center gap-1 hover:text-slate-900 dark:hover:text-[#CDF22B] transition-colors cursor-pointer ${
                isLiked ? "text-slate-900 dark:text-[#CDF22B] font-bold" : ""
              }`}
            >
              <Heart size={13} className={isLiked ? "fill-current text-[#CDF22B]" : ""} />
              <span>{likesCount}</span>
            </button>

            <div className="flex items-center gap-1">
              <Eye size={13} />
              <span>{project.viewsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
