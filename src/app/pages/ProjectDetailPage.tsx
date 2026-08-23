import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Heart,
  Eye,
  Bookmark,
  Share2,
  Calendar,
  Layers,
  Wrench,
  Tag,
  User,
  MessageSquare,
  Send,
  Sparkles,
  Edit3,
  Check,
  AlertCircle,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const {
    getProjectBySlug,
    toggleAppreciation,
    toggleSave,
    incrementViews,
    getProjectComments,
    addComment,
  } = useProjects();

  const project = getProjectBySlug(slug || "");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync initial stats and increment view
  useEffect(() => {
    if (project) {
      setIsLiked(Boolean(project.isAppreciated));
      setLikesCount(project.appreciationsCount || 0);
      setIsSaved(Boolean(project.isSaved));
      incrementViews(project.id);
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 text-center max-w-sm space-y-4 shadow-xl">
          <AlertCircle size={32} className="text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Project Not Found</h2>
          <p className="text-xs text-muted-foreground">
            The case study you are trying to view does not exist or may have been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full btn-primary text-xs font-bold"
          >
            <ArrowLeft size={14} />
            <span>Return to Explore</span>
          </Link>
        </div>
      </div>
    );
  }

  const comments = getProjectComments(project.id);
  const isOwner = user?.id === project.userId || user?.username === project.creator?.username;

  // Handle Appreciate
  const handleAppreciate = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => Math.max(0, prev + (nextState ? 1 : -1)));
    toggleAppreciation(project.id, user?.id);

    if (nextState) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#CDF22B", "#090D16", "#ffffff", "#bfe61e"],
      });
    }
  };

  // Handle Comment Post
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }

    await addComment(
      project.id,
      {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      },
      commentText.trim()
    );

    setCommentText("");
  };

  // Handle Share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const imagesToShow = project.images && project.images.length > 0 ? project.images : [project.coverImage];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
    >
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Explore</span>
        </Link>

        <div className="flex items-center gap-2">
          {isOwner && (
            <Link
              to={`/project/edit/${project.id}`}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Edit Project</span>
            </Link>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Copy link"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
          </button>
        </div>
      </div>

      {/* Project Header Info Card */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-[#CDF22B]/20 border border-[#CDF22B]/50 text-slate-900 dark:text-[#CDF22B] font-semibold">
            {project.category}
          </span>
          {project.year && (
            <span className="text-muted-foreground flex items-center gap-1 font-mono">
              <Calendar size={12} /> {project.year}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display text-foreground tracking-tight leading-tight">
          {project.title}
        </h1>

        {/* Creator Info Snippet */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          <Link
            to={`/@${project.creator?.username || "creator"}`}
            className="flex items-center gap-3 group"
          >
            <img
              src={
                project.creator?.avatarUrl ||
                `https://api.dicebear.com/7.x/shapes/svg?seed=${project.creator?.username}`
              }
              alt={project.creator?.fullName || "Creator"}
              className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-white dark:border-slate-700 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <p className="text-xs font-bold text-foreground group-hover:text-[#CDF22B] transition-colors">
                {project.creator?.fullName || "Creative Member"}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                @{project.creator?.username || "creator"}
              </p>
            </div>
          </Link>

          {/* Appreciate CTA Button */}
          <button
            onClick={handleAppreciate}
            className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
              isLiked
                ? "bg-[#CDF22B] text-slate-900 shadow-md shadow-[#CDF22B]/30"
                : "glass-card hover:bg-[#CDF22B] hover:text-slate-900 text-foreground border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Heart size={15} className={isLiked ? "fill-current" : ""} />
            <span>{isLiked ? "Appreciated" : "Appreciate"}</span>
            <span className="opacity-75 font-mono">({likesCount})</span>
          </button>
        </div>
      </div>

      {/* Imagery Showcase (Cover + Gallery) */}
      <div className="space-y-6">
        {imagesToShow.map((imgUrl, index) => (
          <div
            key={index}
            className="rounded-3xl overflow-hidden glass-card border border-slate-200/80 dark:border-slate-800/80 shadow-md bg-slate-100 dark:bg-slate-900"
          >
            <img
              src={imgUrl}
              alt={`${project.title} image ${index + 1}`}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>

      {/* Project Description & Narrative */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <h2 className="text-base font-bold font-display text-foreground">
          About This Project
        </h2>
        <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {project.fullDescription || project.description}
        </div>

        {/* Tools & Tags Metadata */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {project.tools && project.tools.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Wrench size={13} className="text-[#CDF22B]" />
                <span>Tools Used</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground text-xs font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Tag size={13} className="text-[#CDF22B]" />
                <span>Tags</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] text-xs font-medium border border-[#CDF22B]/40"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Appreciation Bar */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground">
            Enjoyed this case study?
          </h3>
          <p className="text-xs text-muted-foreground">
            Show your appreciation to support {project.creator?.fullName || "the creator"}.
          </p>
        </div>

        <button
          onClick={handleAppreciate}
          className="px-8 py-3 rounded-full btn-primary text-xs font-bold shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
          <span>{isLiked ? "Appreciated" : "Give Appreciation"} ({likesCount})</span>
        </button>
      </div>

      {/* Comments & Community Discussion Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#CDF22B]" />
          <h3 className="text-base font-bold font-display text-foreground">
            Comments & Feedback ({comments.length})
          </h3>
        </div>

        {/* Comment Input */}
        {isLoggedIn ? (
          <form onSubmit={handlePostComment} className="flex gap-3">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/shapes/svg?seed=${user?.username}`
              }
              alt={user?.fullName}
              className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share thoughtful feedback or ask a question..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B]"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-5 py-2.5 rounded-2xl btn-primary text-xs font-bold active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Sign in to join the conversation and leave feedback for this project.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-primary text-xs font-bold"
            >
              Sign In to Comment
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4 pt-2">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60"
              >
                <img
                  src={
                    c.user?.avatarUrl ||
                    `https://api.dicebear.com/7.x/shapes/svg?seed=${c.user?.username || "anon"}`
                  }
                  alt={c.user?.fullName}
                  className="w-7 h-7 rounded-full object-cover bg-slate-100 shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {c.user?.fullName}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              Be the first to leave a comment on this project!
            </p>
          )}
        </div>
      </div>
    </motion.main>
  );
}
