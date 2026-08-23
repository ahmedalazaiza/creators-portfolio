import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
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
  BarChart2,
  Mail,
  Calendar,
  DollarSign,
  Briefcase,
  Pin,
  Check,
  CheckCheck,
  ShieldAlert,
  X,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import { useInquiries } from "../hooks/useInquiries";
import { useModeration } from "../hooks/useModeration";
import { useLanguage } from "../context/LanguageContext";
import { Project } from "../types";

// Analytics Sample Data
const ANALYTICS_7D = [
  { day: "Mon", views: 420, appreciations: 38 },
  { day: "Tue", views: 680, appreciations: 55 },
  { day: "Wed", views: 950, appreciations: 82 },
  { day: "Thu", views: 820, appreciations: 70 },
  { day: "Fri", views: 1240, appreciations: 110 },
  { day: "Sat", views: 1480, appreciations: 142 },
  { day: "Sun", views: 1390, appreciations: 128 },
];

const ANALYTICS_30D = [
  { day: "Week 1", views: 4200, appreciations: 380 },
  { day: "Week 2", views: 5600, appreciations: 490 },
  { day: "Week 3", views: 7800, appreciations: 640 },
  { day: "Week 4", views: 9200, appreciations: 810 },
];

type StudioTab = "projects" | "analytics" | "inquiries" | "moderation";

export default function DashboardPage() {
  const { allProjects, saveProject, deleteProject } = useProjects();
  const { user } = useAuth();
  const { inquiries, markInquiryStatus, deleteInquiry } = useInquiries();
  const { reports, pendingCount, dismissReport, resolveReport } = useModeration();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<StudioTab>("projects");
  const [analyticsRange, setAnalyticsRange] = useState<"7D" | "30D">("7D");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Filter projects belonging to creator
  const userProjects = allProjects.filter(
    (p) =>
      p.userId === user?.id ||
      p.creator.username === user?.username ||
      p.creator.id === user?.id
  );

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

  // Top Performing Projects
  const topProjects = [...displayedProjects]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 4);

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
  const unreadInquiries = inquiries.filter((inq) => inq.status === "unread").length;

  const handleToggleStatus = (project: Project) => {
    const nextStatus = project.status === "published" ? "draft" : "published";
    saveProject({ id: project.id, status: nextStatus }, user);
  };

  const handleTogglePin = (project: Project) => {
    saveProject({ id: project.id, isPinnedToProfile: !project.isPinnedToProfile }, user);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const chartData = analyticsRange === "7D" ? ANALYTICS_7D : ANALYTICS_30D;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Studio Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">
                {t("studio.subtitle", "Creator Studio Benchmark")}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                · @{user?.username || "ahmed_azaiza"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
              {t("studio.title", "Studio Command Center")}
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
              <span>{t("studio.createBtn", "Create New Project")}</span>
            </Link>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1.5 font-bold">
              <Grid size={12} className="text-primary" /> {t("studio.totalWorks", "Total Works")}
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
              <Heart size={12} className="text-rose-500" /> {t("studio.totalAppreciations", "Appreciations")}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              {totalAppreciations.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <TrendingUp size={11} /> +18% engagement rate
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1.5 font-bold">
              <Eye size={12} className="text-primary" /> {t("studio.totalImpressions", "Total Impressions")}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              {totalViews.toLocaleString()}
            </div>
            <span className="text-[10px] text-muted-foreground block font-mono">
              High-converting portfolio reach
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1.5 font-bold">
              <Mail size={12} className="text-primary" /> {t("studio.clientInquiries", "Client Inquiries")}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
              {inquiries.length}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              {unreadInquiries} new pending requests
            </span>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-border pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
              activeTab === "projects"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid size={14} />
            <span>{t("studio.tabWorks", "Case Studies")} ({displayedProjects.length})</span>
            {activeTab === "projects" && (
              <motion.span
                layoutId="studioTabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
              activeTab === "analytics"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart2 size={14} />
            <span>{t("studio.tabAnalytics", "Growth & Analytics")}</span>
            {activeTab === "analytics" && (
              <motion.span
                layoutId="studioTabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
              activeTab === "inquiries"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail size={14} />
            <span>{t("studio.tabInquiries", "Client Inquiries")} ({inquiries.length})</span>
            {unreadInquiries > 0 && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
            {activeTab === "inquiries" && (
              <motion.span
                layoutId="studioTabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("moderation")}
            className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
              activeTab === "moderation"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldAlert size={14} />
            <span>{t("studio.tabModeration", "Content Moderation")} ({reports.length})</span>
            {pendingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-destructive text-white rounded-full font-mono">
                {pendingCount}
              </span>
            )}
            {activeTab === "moderation" && (
              <motion.span
                layoutId="studioTabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/60">
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

              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search studio projects..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-muted/10 space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <FolderPlus size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    No projects found
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ready to showcase your first masterwork?
                  </p>
                </div>
                <Link
                  to="/dashboard/new"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md cursor-pointer"
                >
                  <Plus size={14} /> Create Case Study
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((project) => (
                  <div
                    key={project.id}
                    className="group rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] bg-muted/30 overflow-hidden">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
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
                        {project.isPinnedToProfile && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-mono font-bold text-[10px]">
                            <Pin size={10} /> Pinned
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/project/${project.slug || project.id}`}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-primary hover:text-primary-foreground transition-all shadow-md"
                        title="View live case study"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>

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

                      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-muted-foreground text-[11px] font-mono">
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {(project.viewsCount || 0).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} className="text-rose-500" /> {(project.appreciationsCount || 0).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleTogglePin(project)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              project.isPinnedToProfile
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:text-foreground"
                            }`}
                            title="Pin to Profile Spotlight"
                          >
                            <Pin size={13} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(project)}
                            className="text-[10px] font-mono px-2 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            {project.status === "published" ? "Draft" : "Publish"}
                          </button>

                          <Link
                            to={`/dashboard/edit/${project.id}`}
                            className="p-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted text-foreground transition-colors"
                          >
                            <Edit3 size={13} />
                          </Link>

                          <button
                            onClick={() => {
                              setProjectToDelete(project);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-border bg-muted/30 hover:bg-destructive hover:text-white text-muted-foreground transition-colors cursor-pointer"
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
        )}

        {/* TAB 2: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-foreground">
                Traffic & Engagement Overview
              </h3>

              <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border">
                <button
                  onClick={() => setAnalyticsRange("7D")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    analyticsRange === "7D"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setAnalyticsRange("30D")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    analyticsRange === "30D"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Last 30 Days
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E45FB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1E45FB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAppreciations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CDF22B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#CDF22B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d1117",
                        borderRadius: "12px",
                        border: "1px solid #30363d",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#1E45FB"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      name="Impressions"
                    />
                    <Area
                      type="monotone"
                      dataKey="appreciations"
                      stroke="#CDF22B"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAppreciations)"
                      name="Appreciations"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-display text-foreground">
                Top Performing Masterworks
              </h3>
              <div className="space-y-3">
                {topProjects.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 font-mono text-xs font-bold text-muted-foreground text-center">
                        #{idx + 1}
                      </span>
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-12 h-9 rounded-lg object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/project/${p.slug || p.id}`}
                          className="text-xs font-bold text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {p.title}
                        </Link>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {p.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye size={12} /> {(p.viewsCount || 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-rose-500 font-bold">
                        <Heart size={12} className="fill-rose-500" /> {(p.appreciationsCount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-display text-foreground">
              Commission Leads & Freelance Inquiries ({inquiries.length})
            </h3>

            {inquiries.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-muted/10 space-y-2 max-w-md mx-auto">
                <Mail size={24} className="text-muted-foreground mx-auto" />
                <h4 className="text-sm font-bold text-foreground">No inquiries yet</h4>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      inq.status === "unread"
                        ? "border-primary/40 bg-primary/5 shadow-xs"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground">
                            {inq.clientName}
                          </h4>
                          {inq.companyName && (
                            <span className="text-xs text-muted-foreground">
                              · {inq.companyName}
                            </span>
                          )}
                          {inq.status === "unread" && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <a
                          href={`mailto:${inq.clientEmail}`}
                          className="text-xs text-primary hover:underline font-mono"
                        >
                          {inq.clientEmail}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 text-foreground flex items-center gap-1 font-semibold">
                          <DollarSign size={12} className="text-primary" /> {inq.budgetRange}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 text-foreground flex items-center gap-1">
                          <Calendar size={12} className="text-primary" /> {inq.projectTimeline}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-3 rounded-xl border border-border/50">
                      {inq.projectBrief}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Received {new Date(inq.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {inq.status === "unread" ? (
                          <button
                            onClick={() => markInquiryStatus(inq.id, "read")}
                            className="px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1 cursor-pointer"
                          >
                            <Check size={13} /> Mark Read
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                            <CheckCheck size={13} className="text-emerald-400" /> Read
                          </span>
                        )}

                        <a
                          href={`mailto:${inq.clientEmail}?subject=Re: Commission Project Inquiry&body=Hi ${inq.clientName},%0D%0A%0D%0AThank you for reaching out...`}
                          className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 flex items-center gap-1.5"
                        >
                          <Mail size={13} /> Reply via Email
                        </a>

                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTENT MODERATION */}
        {activeTab === "moderation" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-display text-foreground">
              Community Reports & Moderation Queue ({reports.length})
            </h3>

            {reports.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-muted/10 space-y-2 max-w-md mx-auto">
                <ShieldAlert size={24} className="text-muted-foreground mx-auto" />
                <h4 className="text-sm font-bold text-foreground">Moderation queue clean</h4>
                <p className="text-xs text-muted-foreground">No pending reports flagged by the community.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      rep.status === "pending"
                        ? "border-destructive/40 bg-destructive/5"
                        : "border-border bg-card opacity-70"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-destructive text-white font-mono text-[10px] font-bold uppercase">
                            {rep.reason}
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            Target: {rep.targetTitle || rep.targetId}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-muted-foreground">
                        Reported {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {rep.details && (
                      <p className="text-xs text-foreground bg-muted/30 p-3 rounded-xl">
                        {rep.details}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Status: <strong className="text-foreground uppercase">{rep.status}</strong>
                      </span>

                      {rep.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dismissReport(rep.id)}
                            className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            Dismiss Report
                          </button>
                          <button
                            onClick={() => resolveReport(rep.id)}
                            className="px-4 py-1.5 rounded-full bg-destructive text-white text-xs font-bold hover:opacity-90 cursor-pointer"
                          >
                            Resolve & Hide Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
