import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Globe,
  Check,
  Mail,
  Sparkles,
  Eye,
  Heart,
  Users,
  Grid,
  Bookmark,
  Info,
  ExternalLink,
  Twitter,
  Dribbble,
  Linkedin,
  Github,
  Instagram,
  UserPlus,
  UserCheck,
  Award,
  Layers,
  Wrench,
  FolderHeart,
  ArrowUpRight,
  Pin,
} from "lucide-react";
import { useCreator } from "../hooks/useCreator";
import { useAuth } from "../context/AuthContext";
import { useCollections } from "../hooks/useCollections";
import ProjectCard from "../components/ProjectCard";
import HireModal from "../components/HireModal";

type TabType = "work" | "moodboards" | "appreciations" | "followers";

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("work");
  const [hireModalOpen, setHireModalOpen] = useState(false);

  const {
    creator,
    creatorProjects,
    appreciatedProjects,
    savedProjects,
    followersList,
    isFollowing,
    toggleFollow,
  } = useCreator(username);

  const { user } = useAuth();
  const { collections } = useCollections();

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Creator Not Found
          </h1>
          <p className="text-muted-foreground mb-5 text-xs">
            We couldn't find a portfolio for @{username}.
          </p>
          <Link
            to="/creators"
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs"
          >
            Explore Leading Creators
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.username?.toLowerCase() === creator.username.toLowerCase();

  // Pinned / Featured Projects
  const pinnedProjects = creatorProjects.filter((p) => p.isPinnedToProfile || p.isFeatured);
  const otherProjects = creatorProjects.filter((p) => !p.isPinnedToProfile && !p.isFeatured);

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background"
      >
        {/* Banner / Backdrop Header */}
        <div className="relative h-44 sm:h-60 w-full overflow-hidden bg-gradient-to-r from-[#0057ff]/25 via-background to-[#0057ff]/10 border-b border-border">
          {creator.bannerUrl && (
            <img
              src={creator.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>

        {/* Main Behance 2-Column Layout */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Creator Identity & Bio (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-5">
                {/* Avatar + Availability Status */}
                <div className="relative inline-block">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.fullName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-background shadow-xl ring-2 ring-border"
                  />
                  {creator.availableForWork && (
                    <button
                      onClick={() => !isOwnProfile && setHireModalOpen(true)}
                      className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-bold tracking-tight shadow-md flex items-center gap-1 border border-background cursor-pointer hover:scale-105 transition-transform"
                      title="Click to hire this creator"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      Available
                    </button>
                  )}
                </div>

                {/* Creator Name & Title */}
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-display font-extrabold text-foreground tracking-tight flex items-center gap-2">
                    <span>{creator.fullName}</span>
                    <Award size={18} className="text-primary fill-primary/20 shrink-0" />
                  </h1>
                  <p className="text-xs text-primary font-mono font-bold">
                    @{creator.username}
                  </p>
                  {creator.headline && (
                    <p className="text-xs text-muted-foreground font-medium pt-1">
                      {creator.headline}
                    </p>
                  )}
                </div>

                {/* Primary Follow & Action Bar */}
                <div className="flex items-center gap-2 pt-1">
                  {isOwnProfile ? (
                    <Link
                      to="/dashboard/settings"
                      className="flex-1 py-2 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold text-center transition-colors shadow-xs"
                    >
                      Edit Studio Profile
                    </Link>
                  ) : (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleFollow(creator.id)}
                        className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                          isFollowing
                            ? "bg-muted text-muted-foreground border border-border"
                            : "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_15px_rgba(205,242,43,0.25)]"
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
                      </motion.button>

                      <button
                        onClick={() => setHireModalOpen(true)}
                        className="px-4 py-2 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Mail size={13} className="text-primary" /> Hire
                      </button>
                    </>
                  )}
                </div>

                {/* Behance Creator Stats Grid */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-center">
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                    <span className="text-[10px] font-mono text-muted-foreground block uppercase font-bold">
                      Project Views
                    </span>
                    <span className="text-sm font-bold font-mono text-foreground">
                      {(creator.totalViews || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                    <span className="text-[10px] font-mono text-muted-foreground block uppercase font-bold">
                      Appreciations
                    </span>
                    <span className="text-sm font-bold font-mono text-foreground">
                      {(creator.totalAppreciations || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                    <span className="text-[10px] font-mono text-muted-foreground block uppercase font-bold">
                      Followers
                    </span>
                    <span className="text-sm font-bold font-mono text-foreground">
                      {(creator.followersCount || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                    <span className="text-[10px] font-mono text-muted-foreground block uppercase font-bold">
                      Following
                    </span>
                    <span className="text-sm font-bold font-mono text-foreground">
                      {(creator.followingCount || 24).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bio & Details */}
                {creator.bio && (
                  <div className="pt-3 border-t border-border space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      About
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {creator.bio}
                    </p>
                  </div>
                )}

                {/* Location & Website */}
                <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                  {creator.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-primary" />
                      <span>{creator.location}</span>
                    </div>
                  )}
                  {creator.website && (
                    <div className="flex items-center gap-2">
                      <Globe size={13} className="text-primary" />
                      <a
                        href={creator.website.startsWith("http") ? creator.website : `https://${creator.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-foreground truncate"
                      >
                        {creator.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>

                {/* Skills Chips */}
                {creator.skills && creator.skills.length > 0 && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      Creative Specialties
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {creator.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-muted/50 border border-border text-foreground text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Channels */}
                <div className="pt-3 border-t border-border flex items-center gap-2 text-muted-foreground">
                  {creator.socialLinks?.twitter && (
                    <a
                      href={creator.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full border border-border bg-card hover:text-primary transition-colors"
                    >
                      <Twitter size={13} />
                    </a>
                  )}
                  {creator.socialLinks?.dribbble && (
                    <a
                      href={creator.socialLinks.dribbble}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full border border-border bg-card hover:text-primary transition-colors"
                    >
                      <Dribbble size={13} />
                    </a>
                  )}
                  {creator.socialLinks?.instagram && (
                    <a
                      href={creator.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full border border-border bg-card hover:text-primary transition-colors"
                    >
                      <Instagram size={13} />
                    </a>
                  )}
                  {creator.socialLinks?.github && (
                    <a
                      href={creator.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full border border-border bg-card hover:text-primary transition-colors"
                    >
                      <Github size={13} />
                    </a>
                  )}
                </div>
              </div>
            </aside>

            {/* Right Column: Behance Portfolio Content (8 cols) */}
            <section className="lg:col-span-8 space-y-6">
              {/* Behance Tab Navigation */}
              <div className="flex items-center gap-5 sm:gap-7 border-b border-border pb-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("work")}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
                    activeTab === "work"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid size={14} />
                  <span>Work ({creatorProjects.length})</span>
                  {activeTab === "work" && (
                    <motion.span
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("moodboards")}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
                    activeTab === "moodboards"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Bookmark size={14} />
                  <span>Moodboards & Collections ({collections.length})</span>
                  {activeTab === "moodboards" && (
                    <motion.span
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("appreciations")}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
                    activeTab === "appreciations"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart size={14} />
                  <span>Appreciations ({appreciatedProjects.length})</span>
                  {activeTab === "appreciations" && (
                    <motion.span
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("followers")}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
                    activeTab === "followers"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Users size={14} />
                  <span>Followers ({followersList.length})</span>
                  {activeTab === "followers" && (
                    <motion.span
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              </div>

              {/* Tab Views */}
              <AnimatePresence mode="wait">
                {activeTab === "work" && (
                  <motion.div
                    key="work"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-6"
                  >
                    {/* Featured / Pinned Spotlight Section */}
                    {pinnedProjects.length > 0 && (
                      <div className="space-y-3 pb-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                          <Pin size={13} />
                          <span>Spotlight Masterworks</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {pinnedProjects.map((p) => (
                            <ProjectCard key={p.id} project={p} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Works Grid */}
                    {creatorProjects.length === 0 ? (
                      <div className="py-16 text-center text-muted-foreground text-xs">
                        No published projects yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pinnedProjects.length > 0 && (
                          <div className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                            All Case Studies
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                          {(pinnedProjects.length > 0 ? otherProjects : creatorProjects).map((p) => (
                            <ProjectCard key={p.id} project={p} />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "moodboards" && (
                  <motion.div
                    key="moodboards"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-8"
                  >
                    {/* Curated Collections / Moodboards Cards */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
                        Curated Moodboards ({collections.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collections.map((col) => (
                          <div
                            key={col.id}
                            className="group rounded-2xl border border-border bg-card p-4 space-y-3 hover:border-primary/50 transition-all"
                          >
                            <div className="relative aspect-[16/10] rounded-xl bg-muted/40 overflow-hidden border border-border">
                              {col.coverImage ? (
                                <img
                                  src={col.coverImage}
                                  alt={col.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <FolderHeart size={24} />
                                </div>
                              )}
                              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-[10px]">
                                {col.projectIds.length} items
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {col.title}
                              </h4>
                              {col.description && (
                                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                  {col.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Bookmarked Works */}
                    {savedProjects.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
                          Direct Bookmarked Items ({savedProjects.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                          {savedProjects.map((p) => (
                            <ProjectCard key={p.id} project={p} />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "appreciations" && (
                  <motion.div
                    key="appreciations"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {appreciatedProjects.length === 0 ? (
                      <div className="py-16 text-center text-muted-foreground text-xs">
                        No appreciated projects yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {appreciatedProjects.map((p) => (
                          <ProjectCard key={p.id} project={p} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "followers" && (
                  <motion.div
                    key="followers"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {followersList.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-primary/40 transition-all"
                      >
                        <Link
                          to={`/@${f.username}`}
                          className="flex items-center gap-3 min-w-0"
                        >
                          <img
                            src={f.avatarUrl}
                            alt={f.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-foreground hover:text-primary transition-colors truncate">
                              {f.fullName}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono truncate">
                              @{f.username}
                            </div>
                          </div>
                        </Link>

                        <button
                          onClick={() => toggleFollow(f.id)}
                          className="shrink-0 text-xs px-3 py-1 rounded-full font-bold border border-border bg-muted/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>
      </motion.main>

      {/* Hire & Commission Dialog Modal */}
      <HireModal
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        creator={creator}
      />
    </>
  );
}
