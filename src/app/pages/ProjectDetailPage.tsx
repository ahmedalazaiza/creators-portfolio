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
  ExternalLink,
  MessageSquare,
  Sparkles,
  Award,
  ZoomIn,
  Check,
  Send,
  Trash2,
  UserPlus,
  UserCheck,
  Mail,
  Palette,
  FolderPlus,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useProjects } from "../hooks/useProjects";
import { useCreator } from "../hooks/useCreator";
import { useAuth } from "../context/AuthContext";
import Lightbox from "../components/Lightbox";
import ShareModal from "../components/ShareModal";
import HireModal from "../components/HireModal";
import SaveToCollectionModal from "../components/SaveToCollectionModal";
import ProjectCard from "../components/ProjectCard";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    getProjectBySlug,
    toggleAppreciation,
    toggleSave,
    incrementViews,
    getProjectComments,
    addComment,
    deleteComment,
    projects: allProjects,
  } = useProjects();

  const { user } = useAuth();
  const project = slug ? getProjectBySlug(slug) : null;
  const { isFollowing, toggleFollow } = useCreator(project?.creator.username);

  const [commentInput, setCommentInput] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  useEffect(() => {
    if (project) {
      incrementViews(project.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Case Study Not Found
          </h1>
          <p className="text-xs text-muted-foreground">
            The project "{slug}" could not be found or has been moved by its creator.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold"
          >
            <ArrowLeft size={14} /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const creator = project.creator;
  const comments = getProjectComments(project.id);
  const allImages = [project.coverImage, ...(project.images || [])];

  const handleLike = () => {
    toggleAppreciation(project.id, user?.id);
    if (!project.isAppreciated) {
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.7 },
        colors: ["#CDF22B", "#1E45FB", "#FF007A"],
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    addComment(
      project.id,
      {
        id: user?.id || `guest-${Date.now()}`,
        username: user?.username || "creative_guest",
        fullName: user?.fullName || "Creative Guest",
        avatarUrl:
          user?.avatarUrl ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      },
      commentInput.trim()
    );

    setCommentInput("");
  };

  // Related projects from same category
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.categoryId === project.categoryId))
    .slice(0, 3);

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background"
      >
        {/* Top Floating Mini Header */}
        <div className="border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-14 sm:top-16 z-20 py-2.5">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft size={13} />
              <span>Explore Gallery</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShareOpen(true)}
                className="p-1.5 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
                title="Share case study"
              >
                <Share2 size={14} />
              </button>

              <button
                onClick={() => setSaveModalOpen(true)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  project.isSaved
                    ? "bg-amber-500 text-white border-amber-400"
                    : "border-border bg-card hover:bg-muted text-foreground"
                }`}
              >
                <Bookmark size={13} className={project.isSaved ? "fill-white" : ""} />
                <span>Save</span>
              </button>

              <button
                onClick={handleLike}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                  project.isAppreciated
                    ? "bg-rose-500 text-white shadow-rose-500/30"
                    : "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_15px_rgba(205,242,43,0.3)]"
                }`}
              >
                <Heart
                  size={13}
                  className={project.isAppreciated ? "fill-white" : ""}
                />
                <span>Appreciate ({project.appreciationsCount || 0})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Behance 2-Column Case Study Layout */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Flowing Visuals (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Project Title & Short Narrative Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold">
                    {project.category}
                  </span>
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/80 border border-primary/40 text-primary text-xs font-mono font-bold">
                      <Sparkles size={11} /> Curated Selection
                    </span>
                  )}
                  <span className="text-xs font-mono text-muted-foreground">
                    Published in {project.year}
                  </span>
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
                className="group relative rounded-2xl overflow-hidden bg-card border border-border cursor-zoom-in shadow-md"
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-auto max-h-[700px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 text-white text-xs font-semibold border border-white/20">
                    <ZoomIn size={13} className="text-primary" /> Full Screen View
                  </span>
                </div>
              </div>

              {/* Full Case Study Narrative */}
              {project.fullDescription && (
                <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
                  <h3 className="text-sm font-bold text-foreground">
                    Art Direction & Technical Approach
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.fullDescription}
                  </p>
                </div>
              )}

              {/* Visual Showcase Stack */}
              {project.images && project.images.length > 0 && (
                <div className="space-y-6 pt-2">
                  {project.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setLightboxIndex(idx + 1);
                        setLightboxOpen(true);
                      }}
                      className="group relative rounded-2xl overflow-hidden bg-card border border-border cursor-zoom-in shadow-sm"
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
              <div className="p-8 rounded-3xl border border-primary/30 bg-gradient-to-b from-card to-primary/5 text-center space-y-4 shadow-lg my-8">
                <h3 className="text-lg font-display font-bold text-foreground">
                  Did this case study inspire you?
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Show your appreciation to help this project get discovered by art directors and curators globally.
                </p>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleLike}
                    className={`px-8 py-3 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
                      project.isAppreciated
                        ? "bg-rose-500 text-white shadow-rose-500/30"
                        : "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_25px_rgba(205,242,43,0.4)]"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={project.isAppreciated ? "fill-white" : ""}
                    />
                    <span>{project.isAppreciated ? "Appreciated" : "Appreciate"} ({project.appreciationsCount || 0})</span>
                  </button>

                  <button
                    onClick={() => setSaveModalOpen(true)}
                    className="p-3 rounded-full border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-md"
                    title="Save to Moodboard"
                  >
                    <Bookmark size={16} className={project.isSaved ? "fill-amber-400 text-amber-400" : ""} />
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <section className="space-y-5 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                    <MessageSquare size={16} className="text-primary" />
                    <span>Feedback & Discussion ({comments.length})</span>
                  </h3>
                </div>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Share feedback on typography, 3D composition, or UX..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-primary/60"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40 hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>Post</span>
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-xl border border-border bg-card/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/@${comment.user.username}`}
                          className="flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors"
                        >
                          <img
                            src={comment.user.avatarUrl}
                            alt={comment.user.fullName}
                            className="w-6 h-6 rounded-full object-cover border border-border"
                          />
                          <span>{comment.user.fullName}</span>
                          <span className="text-[10px] font-mono text-muted-foreground font-normal">
                            @{comment.user.username}
                          </span>
                        </Link>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Specification Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="sticky top-28 space-y-5">
                {/* Project Creator Box */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                    Project Creator
                  </span>

                  <div className="flex items-center gap-3">
                    <Link to={`/@${creator.username}`}>
                      <img
                        src={creator.avatarUrl}
                        alt={creator.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-border hover:border-primary transition-all shadow-sm"
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
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Available for freelance
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => toggleFollow(creator.id)}
                      className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
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

                    <button
                      onClick={() => setHireModalOpen(true)}
                      className="px-4 py-2 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Mail size={13} className="text-primary" /> Hire
                    </button>
                  </div>
                </div>

                {/* Project Metrics & Stats */}
                <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                    Case Study Metrics
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-muted/20 border border-border">
                      <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                        Appreciations
                      </span>
                      <strong className="text-foreground font-mono text-sm">
                        {(project.appreciationsCount || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/20 border border-border">
                      <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                        Views
                      </span>
                      <strong className="text-foreground font-mono text-sm">
                        {(project.viewsCount || 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Tools Badges */}
                  {project.tools && project.tools.length > 0 && (
                    <div className="pt-2 border-t border-border space-y-2">
                      <span className="text-[10px] font-mono text-muted-foreground block uppercase font-bold">
                        Software & Tools Used
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 rounded-md bg-muted/50 border border-border text-foreground text-[11px] font-medium"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="pt-2 border-t border-border space-y-2">
                      <span className="text-[10px] font-mono text-muted-foreground block uppercase font-bold">
                        Creative Keywords
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Related Projects */}
                {relatedProjects.length > 0 && (
                  <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      More in {project.category}
                    </span>
                    <div className="space-y-2.5">
                      {relatedProjects.map((rel) => (
                        <Link
                          key={rel.id}
                          to={`/project/${rel.slug || rel.id}`}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/40 transition-colors group"
                        >
                          <img
                            src={rel.coverImage}
                            alt={rel.title}
                            className="w-12 h-9 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {rel.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono truncate">
                              by {rel.creator.fullName}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.main>

      {/* Lightbox Dialog */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={allImages}
        initialIndex={lightboxIndex}
        projectTitle={project.title}
      />

      {/* Share Dialog */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        projectTitle={project.title}
        projectSlug={project.slug || project.id}
      />

      {/* Hire Modal */}
      <HireModal
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        creator={creator}
      />

      {/* Save to Collection Modal */}
      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        project={project}
      />
    </>
  );
}
