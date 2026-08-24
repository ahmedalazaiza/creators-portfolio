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
  Trash2,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { ProjectDetailSkeleton } from "../components/LoadingSkeletons";
import ShareModal from "../components/ShareModal";
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
    deleteComment,
    loading: projectsLoading,
  } = useProjects(undefined, user?.id);

  const projectFromHook = getProjectBySlug(slug || "");
  const [directProject, setDirectProject] = useState<any>(null);
  const [directLoading, setDirectLoading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // If not found in hook, query Supabase directly
  useEffect(() => {
    if (!projectFromHook && slug && isSupabaseConfigured) {
      const fetchDirect = async () => {
        setDirectLoading(true);
        try {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
          let query = supabase.from("projects").select("*, creator:profiles(*)");

          if (isUuid) {
            query = query.or(`id.eq.${slug},slug.eq.${slug}`);
          } else {
            query = query.eq("slug", slug);
          }

          const { data, error } = await query.maybeSingle();

          if (!error && data) {
            setDirectProject({
              id: data.id,
              slug: data.slug || data.id,
              title: data.title,
              description: data.description,
              fullDescription: data.full_description,
              category: data.category,
              coverImage: data.cover_image,
              accentColor: data.accent_color || "#CDF22B",
              year: data.year || "2025",
              tools: data.tools || [],
              tags: data.tags || [],
              images: data.images || [],
              contentBlocks: data.content_blocks || [],
              creator: data.creator
                ? {
                    id: data.creator.id,
                    username: data.creator.username,
                    fullName: data.creator.full_name || data.creator.fullName,
                    avatarUrl: data.creator.avatar_url || data.creator.avatarUrl,
                    headline: data.creator.headline,
                    bio: data.creator.bio,
                    location: data.creator.location,
                    website: data.creator.website,
                  }
                : null,
              userId: data.user_id,
              status: data.status,
              viewsCount: data.views_count || 0,
              appreciationsCount: data.appreciations_count || 0,
              createdAt: data.created_at,
            });
          }
        } catch (err) {
          console.warn("Direct fetch error in ProjectDetailPage:", err);
        } finally {
          setDirectLoading(false);
        }
      };

      fetchDirect();
    }
  }, [projectFromHook, slug]);

  const project = projectFromHook || directProject;
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
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

  if ((projectsLoading && !project) || directLoading) {
    return <ProjectDetailSkeleton />;
  }

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
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
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

  // Handle Favorite / Save
  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const nextState = !isSaved;
    setIsSaved(nextState);
    toggleSave(project.id, user?.id);
  };

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
    if (!commentText.trim() || isSubmittingComment) return;

    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }

    try {
      setIsSubmittingComment(true);
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
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle Share
  const handleShare = () => {
    setIsShareOpen(true);
  };

  const imagesToShow = project.images && project.images.length > 0 ? project.images : [project.coverImage];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-6 sm:pt-10 pb-24 max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 space-y-8 sm:space-y-10"
    >
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
          className="min-h-[40px] px-3.5 py-2 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer active:scale-95"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {isOwner && (
            <Link
              to={`/project/edit/${project.id}`}
              className="min-h-[40px] px-4 py-2 rounded-full bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 hover:bg-slate-200 text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
            >
              <Edit3 size={14} />
              <span>Edit Project</span>
            </Link>
          )}

          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-slate-100 dark:hover:bg-[#1e231b] text-muted-foreground hover:text-foreground transition-colors cursor-pointer active:scale-95"
            title="Share Project"
            aria-label="Share project"
          >
            <Share2 size={16} />
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

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground tracking-tight leading-tight">
          {project.title}
        </h1>

        {/* Creator Info Snippet */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200/80 dark:border-white/10">
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
              className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-white dark:border-white/10 shadow-xs group-hover:scale-105 transition-transform"
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

          {/* Action Buttons: Favorite & Appreciate */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleToggleFavorite}
              aria-label="Save to favorites"
              title={isLoggedIn ? (isSaved ? "Saved to Favorites" : "Save to Favorites") : "Sign in to save"}
              className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
                isSaved
                  ? "bg-slate-900 text-white dark:bg-[#CDF22B] dark:text-slate-950 shadow-md font-bold"
                  : "glass-card hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground border border-slate-200 dark:border-white/10"
              }`}
            >
              <Bookmark
                size={16}
                className={
                  isSaved
                    ? "fill-white text-white dark:fill-slate-950 dark:text-slate-950"
                    : ""
                }
              />
            </button>

            <button
              onClick={handleAppreciate}
              className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                isLiked
                  ? "bg-[#CDF22B] text-slate-950 border border-[#CDF22B] shadow-md shadow-[#CDF22B]/25"
                  : "glass-card hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground border border-slate-200 dark:border-white/10 hover:border-[#CDF22B]/60"
              }`}
            >
              <Heart
                size={15}
                className={
                  isLiked
                    ? "fill-slate-950 text-slate-950"
                    : "text-foreground"
                }
              />
              <span>{isLiked ? "Appreciated" : "Appreciate"}</span>
              <span className="opacity-80 font-mono">({likesCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Imagery Showcase (Cover + Gallery) */}
      <div className="space-y-6">
        {imagesToShow.map((imgUrl, index) => (
          <div
            key={index}
            className="rounded-3xl overflow-hidden glass-card border border-slate-200/80 dark:border-white/10 shadow-md bg-slate-100 dark:bg-[#171915]"
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
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <h2 className="text-base font-bold font-display text-foreground">
          About This Project
        </h2>
        <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {project.fullDescription || project.description}
        </div>

        {/* Tools & Tags Metadata */}
        <div className="pt-6 border-t border-slate-100 dark:border-white/10 space-y-4">
          {project.tools && project.tools.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Wrench size={13} className="text-slate-800 dark:text-[#CDF22B]" />
                <span>Tools Used</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1e231b] text-foreground text-xs font-medium border border-transparent dark:border-white/10"
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
                <Tag size={13} className="text-slate-800 dark:text-[#CDF22B]" />
                <span>Tags</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1e231b] text-foreground text-xs font-medium border border-slate-200 dark:border-white/10"
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
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
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
          <Heart size={16} className={isLiked ? "fill-current text-slate-950" : "text-slate-950"} />
          <span>{isLiked ? "Appreciated" : "Give Appreciation"} ({likesCount})</span>
        </button>
      </div>

      {/* Comments & Community Discussion Section */}
      <div id="comments-section" className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 scroll-mt-20">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-slate-800 dark:text-[#CDF22B]" />
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
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share thoughtful feedback or ask a question..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-[#CDF22B] transition-colors"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="px-5 py-2.5 rounded-2xl btn-primary text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-xs active:scale-95 transition-transform shrink-0"
              >
                <Send size={13} />
                <span>Post Comment</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 text-xs">
            <p className="text-muted-foreground">
              Sign in to join the discussion, ask questions, and support this creator.
            </p>
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full btn-primary text-slate-950 text-xs font-bold shrink-0"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Comments Feed */}
        <div className="space-y-4 pt-2">
          {comments.length > 0 ? (
            comments.map((c) => {
              const canDelete = isOwner || (user && user.id === c.userId);
              return (
                <div
                  key={c.id}
                  className="flex gap-3.5 p-4 rounded-2xl bg-slate-50/70 dark:bg-[#171915]/60 border border-slate-200/60 dark:border-white/5 group"
                >
                  <Link to={`/@${c.user?.username || "creator"}`}>
                    <img
                      src={
                        c.user?.avatarUrl ||
                        `https://api.dicebear.com/7.x/shapes/svg?seed=${c.user?.username || "user"}`
                      }
                      alt={c.user?.fullName || "Commenter"}
                      className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0"
                    />
                  </Link>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Link
                          to={`/@${c.user?.username || "creator"}`}
                          className="text-xs font-bold text-foreground hover:text-[#CDF22B] transition-colors truncate"
                        >
                          {c.user?.fullName || "Creative Member"}
                        </Link>
                        {c.user?.username && (
                          <span className="text-[11px] text-muted-foreground font-mono">
                            @{c.user.username}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(c.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>

                        {canDelete && (
                          <button
                            onClick={() => deleteComment(c.id)}
                            aria-label="Delete comment"
                            title="Delete comment"
                            className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {c.content}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">
              Be the first to share feedback and start the conversation on this project!
            </p>
          )}
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Fixed, Touch-Friendly) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#11140e]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-white/10 px-3.5 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom,0.65rem))] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* Creator Mini Identity */}
          <Link
            to={`/@${project.creator?.username || "creator"}`}
            className="flex items-center gap-2 min-w-0 pr-1 hover:opacity-80 transition-opacity"
          >
            <img
              src={
                project.creator?.avatarUrl ||
                `https://api.dicebear.com/7.x/shapes/svg?seed=${project.creator?.username}`
              }
              alt={project.creator?.fullName || "Creator"}
              className="w-8 h-8 rounded-full object-cover bg-slate-100 border border-slate-200 dark:border-white/10 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">
                {project.creator?.fullName || "Creator"}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                @{project.creator?.username || "creator"}
              </p>
            </div>
          </Link>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Share Button */}
            <button
              onClick={handleShare}
              aria-label="Share case study"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#181b15] text-foreground transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <Share2 size={16} />
            </button>

            {/* Comment Jump Button */}
            <button
              onClick={() => {
                const commentEl = document.getElementById("comments-section");
                if (commentEl) {
                  commentEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              aria-label="Jump to comments"
              className="relative w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#181b15] text-foreground transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <MessageSquare size={16} />
              {comments.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-mono font-bold flex items-center justify-center border border-white dark:border-slate-950 shadow-xs leading-none">
                  {comments.length}
                </span>
              )}
            </button>

            {/* Bookmark / Save Button */}
            <button
              onClick={handleToggleFavorite}
              aria-label="Save to favorites"
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-95 shadow-2xs ${
                isSaved
                  ? "bg-slate-900 text-white dark:bg-[#CDF22B] dark:text-slate-950 font-bold"
                  : "border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#181b15] text-foreground"
              }`}
            >
              <Bookmark
                size={16}
                className={
                  isSaved
                    ? "fill-white text-white dark:fill-slate-950 dark:text-slate-950"
                    : ""
                }
              />
            </button>

            {/* Hero Appreciate Button */}
            <button
              onClick={handleAppreciate}
              aria-label="Appreciate project"
              className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                isLiked
                  ? "bg-[#CDF22B] text-slate-950 border border-[#CDF22B] shadow-[#CDF22B]/25"
                  : "btn-primary text-slate-950"
              }`}
            >
              <Heart
                size={15}
                className={
                  isLiked
                    ? "fill-slate-950 text-slate-950"
                    : "text-slate-950"
                }
              />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {project && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          type="project"
          title={project.title}
          subtitle={`By ${project.creator?.fullName || "Creator"} • ${project.category}`}
          coverImage={project.coverImage}
          url={window.location.href}
        />
      )}
    </motion.main>
  );
}
