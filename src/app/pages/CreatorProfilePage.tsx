import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  User,
  Plus,
  Grid,
  Bookmark,
  MapPin,
  Globe,
  Share2,
  FolderPlus,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user, isLoggedIn } = useAuth();
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState<"projects" | "saved">("projects");

  const cleanUsername = username ? username.replace(/^@/, "").toLowerCase() : "";

  const isOwnProfile =
    !username ||
    (user && (user.username?.toLowerCase() === cleanUsername || user.id === username));

  const profileUser = useMemo(() => {
    if (isOwnProfile && user) {
      return {
        id: user.id,
        fullName: user.fullName || "Creative Member",
        username: user.username || "creator",
        avatarUrl:
          user.avatarUrl ||
          `https://api.dicebear.com/7.x/shapes/svg?seed=${user.username || "user"}`,
        headline: user.headline || "Digital Product & Visual Designer",
        bio: user.bio || "Passionate creator exploring digital design systems, user experiences, and visual craft.",
        location: user.location || "Riyadh / Global",
        website: user.website || "portfolios.space",
      };
    }

    // Find creator from projects
    const matchedProject = projects.find(
      (p) => p.creator?.username?.toLowerCase() === cleanUsername
    );
    if (matchedProject?.creator) {
      return {
        id: matchedProject.creator.id,
        fullName: matchedProject.creator.fullName,
        username: matchedProject.creator.username,
        avatarUrl: matchedProject.creator.avatarUrl,
        headline: matchedProject.creator.headline || "Digital Creative & Visual Artist",
        bio: matchedProject.creator.bio || "Crafting elevated visual experiences and design systems.",
        location: matchedProject.creator.location || "Global",
        website: matchedProject.creator.website || "portfolios.space",
      };
    }

    return {
      id: "creator",
      fullName: cleanUsername || "Creative Designer",
      username: cleanUsername || "creator",
      avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${cleanUsername || "creator"}`,
      headline: "Creative Designer & Visual Artist",
      bio: "Sharing case studies and visual craft.",
      location: "Global",
      website: "portfolios.space",
    };
  }, [isOwnProfile, user, projects, cleanUsername]);

  // Projects published by this creator
  const creatorProjects = useMemo(() => {
    return projects.filter((p) => {
      if (isOwnProfile && user) {
        return p.userId === user.id || p.creator?.username?.toLowerCase() === user.username?.toLowerCase();
      }
      return p.creator?.username?.toLowerCase() === profileUser.username.toLowerCase();
    });
  }, [projects, isOwnProfile, user, profileUser.username]);

  // Saved projects
  const savedProjects = useMemo(() => {
    return projects.filter((p) => Boolean(p.isSaved));
  }, [projects]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-8 sm:pt-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Top Glassmorphic Profile Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6 relative overflow-hidden">
        {/* Soft atmospheric gradient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#CDF22B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          <img
            src={profileUser.avatarUrl}
            alt={profileUser.fullName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-slate-100 dark:bg-slate-800 shadow-md border-2 border-white dark:border-slate-700 shrink-0"
          />

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
                  {profileUser.fullName}
                </h1>
                <p className="text-xs text-slate-900 dark:text-[#CDF22B] font-mono font-semibold">
                  @{profileUser.username}
                </p>
              </div>

              {isOwnProfile && (
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Upload New Project</span>
                </Link>
              )}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {profileUser.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-foreground" />
                <span>{profileUser.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe size={13} className="text-[#CDF22B]" />
                <span className="font-medium text-foreground">{profileUser.website}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "projects"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Grid size={14} />
          <span>Projects ({creatorProjects.length})</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "saved"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark size={14} />
            <span>Saved ({savedProjects.length})</span>
          </button>
        )}
      </div>

      {/* Projects Grid Display */}
      {activeTab === "projects" ? (
        creatorProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {creatorProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center mx-auto">
              <FolderPlus size={26} />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-semibold text-foreground">
                No projects published yet
              </h3>
              <p className="text-xs text-muted-foreground">
                {isOwnProfile
                  ? "Upload your first project now to showcase your craft on your public profile."
                  : "This creator hasn't published any public projects yet."}
              </p>
            </div>

            {isOwnProfile && (
              <Link
                to="/create"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Upload First Project</span>
              </Link>
            )}
          </div>
        )
      ) : (
        /* Saved Projects Tab */
        savedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {savedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-muted-foreground">
            No saved projects yet.
          </div>
        )
      )}
    </motion.main>
  );
}
