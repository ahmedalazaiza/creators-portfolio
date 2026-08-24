import React, { useState } from "react";
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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col rounded-3xl overflow-hidden glass-card border border-slate-200/80 dark:border-white/10 hover:border-[#CDF22B]/80 shadow-xs hover:shadow-xl hover:shadow-[#CDF22B]/10 transition-all"
    >
      {/* Cover Image Container */}
      <Link to={projectUrl} className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-[#171915] block">
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#070905]/90 backdrop-blur-md text-[11px] font-semibold text-foreground border border-white/40 dark:border-white/10 shadow-xs">
            {project.category}
          </span>
        </div>

        {/* Hover Quick Appreciate & Save Overlay */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Favorite / Bookmark Button */}
          <button
            onClick={handleToggleFavorite}
            aria-label="Save to favorites"
            title={isLoggedIn ? (isSaved ? "Saved to Favorites" : "Save to Favorites") : "Sign in to save"}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isSaved
                ? "bg-[#CDF22B] text-slate-950 shadow-md shadow-[#CDF22B]/40 font-bold"
                : "bg-white/90 dark:bg-[#070905]/90 text-foreground hover:bg-[#CDF22B] hover:text-slate-950"
            }`}
          >
            <Bookmark size={14} className={isSaved ? "fill-current text-slate-950" : ""} />
          </button>

          {/* Like / Appreciate Button */}
          <button
            onClick={handleAppreciate}
            aria-label="Appreciate project"
            title={isLoggedIn ? "Appreciate project" : "Sign in to appreciate"}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isLiked
                ? "bg-[#CDF22B] text-slate-950 shadow-md shadow-[#CDF22B]/35"
                : "bg-white/90 dark:bg-[#070905]/90 text-foreground hover:bg-[#CDF22B] hover:text-slate-950"
            }`}
          >
            <Heart size={14} className={isLiked ? "fill-current text-slate-950" : ""} />
          </button>
        </div>
      </Link>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
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
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
          {/* Creator Profile Link */}
          <Link
            to={`/@${creatorUsername}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0"
          >
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-5 h-5 rounded-full object-cover bg-slate-100 shrink-0 border border-white dark:border-white/10"
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
