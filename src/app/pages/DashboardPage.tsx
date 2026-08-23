import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Heart,
  Grid,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Layers,
  Users,
  Settings,
  ArrowUpRight,
  TrendingUp,
  FolderPlus,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import { Project } from "../types";

export default function DashboardPage() {
  const { allProjects, saveProject, deleteProject } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Filter projects belonging to the logged-in creator or show all in studio demo
  const userProjects = allProjects.filter(
    (p) =>
      p.userId === user?.id ||
      p.creator.username === user?.username ||
      p.creator.id === user?.id
  );

  // Fallback: If user has 0 projects yet, show all projects for demo management
  const displayedProjects = userProjects.length > 0 ? userProjects : allProjects;

  const filtered = displayedProjects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalAppreciations = displayedProjects.reduce(
    (sum, p) => sum + (p.appreciationsCount || 0),
    0
  );
  const totalViews = displayedProjects.reduce(
    (sum, p) => sum + (p.viewsCount || 0),
    0
  );
  const publishedCount = displayedProjects.filter((p) => p.status === "published").length;
  const draftCount = displayedProjects.filter((p) => p.status === "draft").length;

  const handleToggleStatus = (project: Project) => {
    const nextStatus = project.status === "published" ? "draft" : "published";
    saveProject({ id: project.id, status: nextStatus }, user);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">
                Creator Studio & Insights
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                · @{user?.username || "creator"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
              Manage Your Masterworks
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/dashboard/settings"
              className="px-3.5 py-2 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Settings size={13} className="text-muted-foreground" />
              <span>Settings</span>
            </Link>

            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-[0_0_15px_rgba(205,242,43,0.3)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Create New Project</span>
            </Link>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1.5 font-bold">
              <Grid size={12} className="text-primary" /> Total Works
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              {displayedProjects.length}
            </div>
            <span className="text-[10px] text-muted-foreground block font-mono">
              {publishedCount} Published · {draftCount} Drafts
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1.5 font-bold">
              <Heart size={12} className="text-rose-500" /> Appreciations
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              {totalAppreciations.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <TrendingUp size={11} /> +12% this week
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1.5 font-bold">
              <Eye size={12} className="text-primary" /> Total Impressions
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              {totalViews.toLocaleString()}
            </div>
            <span className="text-[10px] text-muted-foreground block font-mono">
              Global Behance traffic
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1.5 font-bold">
              <Users size={12} className="text-primary" /> Followers
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              {(user?.followersCount || 240).toLocaleString()}
            </div>
            <Link
              to="/profile"
              className="text-[10px] text-primary hover:underline font-mono flex items-center gap-0.5"
            >
              View public profile <ArrowUpRight size={10} />
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/60">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({displayedProjects.length})
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "published"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "draft"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search studio projects by title, category, tags..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
            />
          </div>
        </div>

        {/* Studio Projects Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-muted/10 space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <FolderPlus size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                No projects found in this view
              </h3>
              <p className="text-xs text-muted-foreground">
                Ready to showcase your first masterwork to the creative world?
              </p>
            </div>
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 cursor-pointer"
            >
              <Plus size={14} /> Create New Case Study
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                {/* Thumbnail Canvas */}
                <div className="relative aspect-[16/10] bg-muted/30 overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {project.status === "published" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-black font-mono font-bold text-[10px] shadow-sm">
                        <CheckCircle size={10} /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-black font-mono font-bold text-[10px] shadow-sm">
                        <Clock size={10} /> Draft
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Quick Preview Arrow */}
                  <Link
                    to={`/project/${project.slug || project.id}`}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-primary hover:text-primary-foreground transition-all shadow-md"
                    title="View live case study"
                  >
                    <ExternalLink size={13} />
                  </Link>
                </div>

                {/* Content Strip */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <Link
                      to={`/project/${project.slug || project.id}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1 block"
                    >
                      {project.title}
                    </Link>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Stats & Actions Row */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    {/* Metrics */}
                    <div className="flex items-center gap-3 text-muted-foreground text-[11px] font-mono">
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {(project.viewsCount || 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={12} className="text-rose-500" /> {(project.appreciationsCount || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(project)}
                        className={`text-[10px] font-mono px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                          project.status === "published"
                            ? "border-border text-muted-foreground hover:text-foreground"
                            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold"
                        }`}
                        title={project.status === "published" ? "Unpublish to draft" : "Publish to live"}
                      >
                        {project.status === "published" ? "Make Draft" : "Publish"}
                      </button>

                      <Link
                        to={`/dashboard/edit/${project.id}`}
                        className="p-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted text-foreground transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 size={13} />
                      </Link>

                      <button
                        onClick={() => {
                          setProjectToDelete(project);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-border bg-muted/30 hover:bg-destructive hover:text-white text-muted-foreground transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-2xl border border-border bg-card p-6 max-w-sm w-full space-y-4 shadow-2xl z-10"
            >
              <h3 className="text-base font-bold text-foreground">
                Delete "{projectToDelete.title}"?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This action is permanent and cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-1.5 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 rounded-full bg-destructive text-white text-xs font-bold hover:opacity-90"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
