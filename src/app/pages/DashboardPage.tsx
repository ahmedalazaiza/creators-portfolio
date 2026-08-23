import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  Plus,
  Eye,
  Heart,
  Grid,
  TrendingUp,
  FolderPlus,
  User,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
              CREATOR DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Welcome back, {user?.fullName || "Creator"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your works, monitor engagement, and publish new case studies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="px-4 py-2 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground text-xs font-medium border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <User size={14} className="text-indigo-500" />
            <span>View Public Profile</span>
          </Link>

          <Link
            to="/create"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create New Project</span>
          </Link>
        </div>
      </div>

      {/* 3 Soft Glassmorphic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Project Views</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Eye size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-foreground">
            0
          </div>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" /> Ready to track visitors
          </span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Appreciations & Likes</span>
            <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
              <Heart size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-foreground">
            0
          </div>
          <span className="text-[11px] text-muted-foreground">
            Community feedback
          </span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Published Projects</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Grid size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-foreground">
            0
          </div>
          <span className="text-[11px] text-muted-foreground">
            Live case studies
          </span>
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-foreground">
            Your Projects
          </h2>
        </div>

        {/* Empty State */}
        <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 sm:p-16 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <FolderPlus size={26} />
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-semibold text-foreground">
              You haven't uploaded any projects yet
            </h3>
            <p className="text-xs text-muted-foreground">
              In Phase 2, you'll be able to publish multi-image visual case studies and manage live drafts.
            </p>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create First Project</span>
          </Link>
        </div>
      </div>
    </motion.main>
  );
}
