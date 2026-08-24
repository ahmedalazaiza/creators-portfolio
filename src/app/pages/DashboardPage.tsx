import React, { useMemo } from "react";
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
  Edit3,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { ProjectGridSkeleton } from "../components/LoadingSkeletons";

export default function DashboardPage() {
  const { user } = useAuth();
  const { allProjects, deleteProject, loading } = useProjects(undefined, user?.id);

  // Filter projects belonging to current user
  const userProjects = useMemo(() => {
    if (!user) return [];
    return allProjects.filter(
      (p) => p.userId === user.id || p.creator?.username === user.username
    );
  }, [allProjects, user]);

  // Aggregate stats
  const totalViews = useMemo(
    () => userProjects.reduce((acc, p) => acc + (p.viewsCount || 0), 0),
    [userProjects]
  );
  const totalAppreciations = useMemo(
    () => userProjects.reduce((acc, p) => acc + (p.appreciationsCount || 0), 0),
    [userProjects]
  );

  const handleDelete = async (projectId: string, projectTitle: string) => {
    if (confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      await deleteProject(projectId);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-8 sm:pt-10 pb-20 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 space-y-8"
    >
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-[#CDF22B] bg-[#CDF22B]/20 px-2 py-0.5 rounded-md">
              CREATOR DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Welcome back, {user?.fullName || "Creator"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your published case studies, track visitor reach, and launch new projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={user?.username ? `/@${user.username}` : "/profile"}
            className="px-4 py-2 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground text-xs font-semibold border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <User size={14} className="text-foreground" />
            <span>Public Profile</span>
          </Link>

          <Link
            to="/create"
            className="px-5 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Upload New Project</span>
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Project Views</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#1e231b] text-foreground">
              <Eye size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-foreground">
            {totalViews}
          </div>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" /> Active visitor tracking
          </span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Appreciations & Likes</span>
            <div className="p-2 rounded-xl bg-slate-900 dark:bg-[#1e231b] text-[#CDF22B]">
              <Heart size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-foreground">
            {totalAppreciations}
          </div>
          <span className="text-[11px] text-muted-foreground">
            Community appreciations received
          </span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Published Projects</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#1e231b] text-foreground">
              <Grid size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-foreground">
            {userProjects.length}
          </div>
          <span className="text-[11px] text-muted-foreground">
            Live in showcase directory
          </span>
        </div>
      </div>

      {/* Projects Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-foreground">
            Your Uploaded Projects ({userProjects.length})
          </h2>
        </div>

        {loading && userProjects.length === 0 ? (
          <ProjectGridSkeleton count={3} />
        ) : userProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {userProjects.map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-[#CDF22B] shadow-xs flex flex-col justify-between transition-colors"
              >
                <div className="relative aspect-video bg-slate-100 dark:bg-[#171915]">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-[11px] font-semibold text-[#CDF22B]">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10 text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <Heart size={12} className="text-slate-900 dark:text-[#CDF22B] fill-current" /> {p.appreciationsCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {p.viewsCount || 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/project/${p.slug || p.id}`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e231b] text-muted-foreground hover:text-foreground"
                        title="View Live"
                      >
                        <ExternalLink size={14} />
                      </Link>

                      <Link
                        to={`/project/edit/${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e231b] text-muted-foreground hover:text-foreground"
                        title="Edit Project"
                      >
                        <Edit3 size={14} />
                      </Link>

                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-12 sm:p-16 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center mx-auto">
              <FolderPlus size={26} />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-semibold text-foreground">
                You haven't uploaded any projects yet
              </h3>
              <p className="text-xs text-muted-foreground">
                Upload your first case study now to showcase it on the homepage and your creator profile!
              </p>
            </div>

            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus size={14} />
              <span>Upload First Project</span>
            </Link>
          </div>
        )}
      </div>
    </motion.main>
  );
}
