import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Eye,
  Heart,
  Bookmark,
  Share2,
  ZoomIn,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  Wrench,
  Tag,
  Mail,
  Check,
  Send,
  ArrowUpRight,
  UserPlus,
  UserCheck,
  Award,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useCreator } from "../hooks/useCreator";
import { useAuth } from "../context/AuthContext";
import Lightbox from "../components/Lightbox";
import ShareModal from "../components/ShareModal";
import ProjectCard from "../components/ProjectCard";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    getProjectBySlug,
    toggleAppreciation,
    toggleSave,
    incrementViews,
    getProjectComments,
    addComment,
    allProjects,
  } = useProjects();

  const project = getProjectBySlug(slug || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { isFollowing, toggleFollow } = useCreator(project?.creator?.username);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (project) {
      incrementViews(project.id);
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Project Not Found
          </h1>
          <p className="text-muted-foreground mb-5 text-xs">
            The project you are looking for may have been removed or made private.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md"
          >
            <ChevronLeft size={14} /> Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [project.coverImage, ...(project.images || [])].filter(
    (img, idx, self) => self.indexOf(img) === idx && Boolean(img)
  );

  const comments = getProjectComments(project.id);
  const creator = project.creator;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const commenter = user || {
      id: "guest-user",
      username: "guest_designer",
      fullName: "Guest Designer",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    };

    addComment(project.id, commenter, commentText.trim());
    setCommentText("");
  };

  const moreByCreator = allProjects
    .filter((p) => p.userId === project.userId && p.id !== project.id)
    .slice(0, 3);

  const relatedProjects = allProjects
    .filter(
      (p) =>
        p.id !== project.id &&
        p.categoryId === project.categoryId &&
        p.userId !== project.userId
    )
    .slice(0, 3);

  const projectUrl = window.location.href;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background"
    >
      {/* Behance Top Project Header Strip */}
      <div className="border-b border-border/40 bg-card/30 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Discover</span>
          </button>

          {/* Quick Share / Like on top */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSave(project.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                project.isSaved
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark size={12} className={project.isSaved ? "fill-amber-400" : ""} />
              <span>{project.isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={() => setShareOpen(true)}
              className="p-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Behance Case Study Grid (Content Left, Sticky Sidebar Right) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Case Study Canvas (Behance Presentation) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Project Title & Overview Banner */}
          <div className="space-y-3 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-muted text-foreground font-semibold">
                {project.category}
              </span>
              {project.isFeatured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-bold">
                  <Sparkles size={11} /> Behance Curated
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Cover Hero Canvas */}
          <div
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            className="group relative rounded-xl overflow-hidden bg-card border border-border cursor-zoom-in shadow-md"
          >
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-auto max-h-[700px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 text-white text-xs font-semibold border border-white/20">
                <ZoomIn size={13} className="text-primary" /> Full View
              </span>
            </div>
          </div>

          {/* Full Case Study Narrative */}
          {project.fullDescription && (
            <div className="p-6 rounded-xl border border-border bg-card/40 space-y-3">
              <h3 className="text-sm font-bold text-foreground">
                About the Case Study
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.fullDescription}
              </p>
            </div>
          )}

          {/* Visual Showcase Stack */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-5 pt-2">
              {project.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setLightboxIndex(idx + 1);
                    setLightboxOpen(true);
                  }}
                  className="group relative rounded-xl overflow-hidden bg-card border border-border cursor-zoom-in shadow-sm"
                >
                  <img
                    src={img}
                    alt={`${project.title} gallery ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-auto max-h-[700px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/80 text-white text-xs font-semibold">
                      <ZoomIn size={12} className="text-primary" /> View Lightbox
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Behance Bottom "Appreciate Project" Big Action Card */}
          <div className="p-8 rounded-2xl border border-primary/30 bg-gradient-to-b from-card to-primary/5 text-center space-y-4 shadow-lg my-8">
            <h3 className="text-lg font-display font-bold text-foreground">
              Did you like this case study?
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Show your appreciation to help this project get featured on the Behance leaderboard.
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAppreciation(project.id)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                project.isAppreciated
                  ? "bg-rose-500 text-white shadow-rose-500/30"
                  : "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(170,255,56,0.3)] hover:opacity-90"
              }`}
            >
              <Heart
                size={16}
                className={project.isAppreciated ? "fill-white" : ""}
              />
              <span>
                {project.isAppreciated ? "Appreciated" : "Appreciate Project"} (
                {(project.appreciationsCount || 0).toLocaleString()})
              </span>
            </motion.button>
          </div>

          {/* Comments Discussion */}
          <section className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Discussion ({comments.length})
              </h3>
            </div>

            <form onSubmit={handlePostComment} className="flex gap-2.5">
              <img
                src={
                  user?.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                }
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Give feedback or ask the designer a question..."
                  className="w-full pl-3 pr-20 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold disabled:opacity-40"
                >
                  Post
                </button>
              </div>
            </form>

            <div className="space-y-2.5 pt-1">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="flex gap-2.5 p-3 rounded-xl border border-border/50 bg-card/30 text-xs"
                >
                  <Link to={`/@${c.user.username}`}>
                    <img
                      src={c.user.avatarUrl}
                      alt={c.user.fullName}
                      className="w-7 h-7 rounded-full object-cover border border-border"
                    />
                  </Link>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/@${c.user.username}`}
                        className="font-bold text-foreground hover:text-primary transition-colors"
                      >
                        {c.user.fullName}
                      </Link>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Behance Specification Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          <div className="sticky top-20 space-y-5">
            {/* Project Creator Box */}
            <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Project Owner
              </span>

              <div className="flex items-center gap-3">
                <Link to={`/@${creator.username}`}>
                  <img
                    src={creator.avatarUrl}
                    alt={creator.fullName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-border hover:border-primary transition-all"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    to={`/@${creator.username}`}
                    className="font-bold text-xs text-foreground hover:text-primary transition-colors truncate block"
                  >
                    {creator.fullName}
                  </Link>
                  <span className="text-[10px] font-mono text-muted-foreground block truncate">
                    @{creator.username}
                  </span>
                  {creator.availableForWork && (
                    <span className="inline-block text-[10px] font-mono text-emerald-400 font-semibold">
                      ● Available for freelance
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => toggleFollow(creator.id)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isFollowing
                      ? "border border-border bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={13} /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} /> Follow
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${creator.username}@designers.gallery?subject=Commission Request`}
                  className="px-3.5 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Mail size={12} /> Hire
                </a>
              </div>
            </div>

            {/* Project Metrics & Stats */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Project Information
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Appreciations
                  </span>
                  <strong className="text-foreground font-mono">
                    {(project.appreciationsCount || 0).toLocaleString()}
                  </strong>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Views
                  </span>
                  <strong className="text-foreground font-mono">
                    {(project.viewsCount || 0).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Tools Badges */}
              {project.tools && project.tools.length > 0 && (
                <div className="pt-2 border-t border-border space-y-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Software & Tools Used
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 rounded-md border border-border bg-muted/40 text-foreground text-[10px] font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="pt-2 border-t border-border space-y-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Published Date */}
              <div className="pt-2 border-t border-border text-[10px] font-mono text-muted-foreground flex items-center justify-between">
                <span>Published in</span>
                <span className="text-foreground font-bold">{project.year || "2025"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More by Creator Section */}
      {moreByCreator.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-14 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">
              More by {creator.fullName}
            </h3>
            <Link
              to={`/@${creator.username}`}
              className="text-xs text-primary font-mono hover:underline flex items-center gap-1"
            >
              View Profile <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {moreByCreator.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* You Might Also Like */}
      {relatedProjects.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">
              You Might Also Like
            </h3>
            <Link
              to={`/?category=${project.categoryId}`}
              className="text-xs text-primary font-mono hover:underline flex items-center gap-1"
            >
              Explore {project.category} <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {relatedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={allImages}
        initialIndex={lightboxIndex}
        projectTitle={project.title}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Share Dialog */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={project.title}
        url={projectUrl}
      />
    </motion.main>
  );
}
