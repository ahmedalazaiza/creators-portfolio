import React, { useState } from "react";
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

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<"projects" | "saved">("projects");

  const isOwnProfile =
    !username ||
    (user && (user.username === username || user.username === username.replace(/^@/, "")));

  const displayName = isOwnProfile
    ? user?.fullName || "Creative Member"
    : username?.replace(/^@/, "") || "Creator";

  const displayUsername = isOwnProfile
    ? user?.username || "creator"
    : username?.replace(/^@/, "") || "creator";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Top Glassmorphic Profile Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6 relative overflow-hidden">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          <img
            src={
              isOwnProfile && user?.avatarUrl
                ? user.avatarUrl
                : `https://api.dicebear.com/7.x/shapes/svg?seed=${displayUsername}`
            }
            alt={displayName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-slate-100 dark:bg-slate-800 shadow-md border-2 border-white dark:border-slate-700 shrink-0"
          />

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
                  {displayName}
                </h1>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                  @{displayUsername}
                </p>
              </div>

              {isOwnProfile && (
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>New Project</span>
                </Link>
              )}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              {isOwnProfile && user?.bio
                ? user.bio
                : "Passionate creator exploring digital design systems, user experiences, and visual craft."}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-indigo-500" />
                <span>Riyadh / Global</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe size={13} className="text-purple-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">portfolios.space</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-1">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "projects"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Grid size={14} />
          <span>Projects (0)</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "saved"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bookmark size={14} />
          <span>Saved (0)</span>
        </button>
      </div>

      {/* Projects / Saved Content Empty State */}
      <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 sm:p-16 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <FolderPlus size={26} />
        </div>

        <div className="space-y-1.5 max-w-sm mx-auto">
          <h3 className="text-base font-semibold text-foreground">
            No projects published yet
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Case studies and creative works published in upcoming phases will show here in a modern grid.
          </p>
        </div>

        {isOwnProfile && (
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create First Project</span>
          </Link>
        )}
      </div>
    </motion.main>
  );
}
