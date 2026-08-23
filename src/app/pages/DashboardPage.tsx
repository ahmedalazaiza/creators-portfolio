import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Plus,
  Grid,
  Eye,
  Heart,
  Pencil,
  Trash2,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Settings,
  User,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import ConfirmModal from "../components/ConfirmModal";
import { Project } from "../types";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { allProjects, deleteProject, saveProject } = useProjects();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // If no user is logged in, redirect or show prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">
            Authentication Required
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            Please sign in to access your creator studio and manage projects.
          </p>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md"
          >
            Sign In to Studio
          </Link>
        </div>
      </div>
    );
  }

  // Filter projects owned by current user or show all in preview mode
  const userProjects = allProjects.filter(
    (p) => p.userId === user.id || p.creator?.username === user.username
  );

  // Fallback: If user has 0 projects yet, show all projects for demo management
  const displayedProjects = userProjects.length > 0 ? userProjects : allProjects;

  const filtered = displayedProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAppreciations = displayedProjects.reduce(
    (sum, p) => sum + (p.appreciationsCount || 0),
    0
  );
  const totalViews = displayedProjects.reduce(
    (sum, p) => sum + (p.viewsCount || 0),
    0
  );

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
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-16 sm:pt-20 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
                Creator Studio
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                · @{user.username}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground">
              Project Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/@${user.username}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all"
            >
              <User size={14} /> View Public Profile
            </Link>

            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-[0_0_20px_rgba(170,255,56,0.25)] hover:opacity-90 transition-all"
            >
              <Plus size={16} /> New Case Study
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card/70 space-y-1">
            <span className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5">
              <Grid size={13} className="text-primary" /> Total Works
            </span>
            <div className="text-2xl font-bold font-mono text-foreground">
              {displayedProjects.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card/70 space-y-1">
            <span className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5">
              <Heart size={13} className="text-rose-500" /> Appreciations
            </span>
            <div className="text-2xl font-bold font-mono text-foreground">
              {totalAppreciations.toLocaleString()}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card/70 space-y-1">
            <span className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5">
              <Eye size={13} className="text-primary" /> Impressions
            </span>
            <div className="text-2xl font-bold font-mono text-foreground">
              {totalViews.toLocaleString()}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card/70 space-y-1">
            <span className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" /> Status
            </span>
            <div className="text-xs font-mono text-emerald-400 pt-1 font-semibold flex items-center gap-1">
              <CheckCircle size={14} /> Available For Commission
            </div>
          </div>
        </div>

        {/* Projects Table / List */}
        <div className="p-6 rounded-3xl border border-border bg-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-display text-foreground">
                All Case Studies
              </h2>
              <p className="text-xs text-muted-foreground">
                Edit case studies, manage images, and toggle publishing visibility.
              </p>
            </div>

            {/* Quick search in dashboard */}
            <div className="w-full sm:w-64 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title or field..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-xs">No projects match your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-mono uppercase text-[10px]">
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Category</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">Stats</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.map((proj) => (
                    <tr key={proj.id} className="hover:bg-muted/20 transition-colors">
                      {/* Project Cover + Title */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={proj.coverImage}
                            alt={proj.title}
                            className="w-14 h-11 rounded-xl object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-foreground truncate max-w-xs sm:max-w-sm">
                              {proj.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              /{proj.slug} · {proj.year}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 pr-4 hidden md:table-cell text-muted-foreground font-medium">
                        {proj.category}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 pr-4">
                        <button
                          onClick={() => handleToggleStatus(proj)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                            proj.status === "published"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                          }`}
                          title="Click to toggle status"
                        >
                          {proj.status === "published" ? (
                            <>
                              <CheckCircle size={12} /> Published
                            </>
                          ) : (
                            <>
                              <Clock size={12} /> Draft
                            </>
                          )}
                        </button>
                      </td>

                      {/* Metrics */}
                      <td className="py-4 pr-4 hidden sm:table-cell">
                        <div className="flex items-center gap-3 font-mono text-muted-foreground text-[11px]">
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {(proj.viewsCount || 0).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} className="text-rose-500" />{" "}
                            {(proj.appreciationsCount || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/project/${proj.slug}`}
                            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Preview case study"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          <Link
                            to={`/dashboard/edit/${proj.id}`}
                            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit project"
                          >
                            <Pencil size={15} />
                          </Link>

                          <button
                            onClick={() => {
                              setProjectToDelete(proj);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Case Study"
        message="Are you sure you want to permanently remove this case study? This action cannot be undone."
        itemName={projectToDelete?.title}
        confirmText="Delete Project"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
      />
    </motion.main>
  );
}
