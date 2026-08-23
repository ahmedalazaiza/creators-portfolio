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
} from "lucide-react";
import { useCreator } from "../hooks/useCreator";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";

type TabType = "work" | "moodboards" | "appreciations" | "followers" | "about";

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("work");

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
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md"
          >
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const isCurrentUser = user?.username === creator.username || user?.id === creator.id;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background"
    >
      {/* Behance Wide Header Banner */}
      <div className="relative h-36 sm:h-52 w-full bg-muted/40 overflow-hidden border-b border-border/40">
        {creator.bannerUrl ? (
          <img
            src={creator.bannerUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-muted via-primary/10 to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />
      </div>

      {/* Behance 2-Column Profile Layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Behance Creator Sidebar Card (4 cols) */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-2xl border border-border bg-card shadow-md space-y-4">
              {/* Avatar + Verified Status */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.fullName}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-background bg-card shadow-lg"
                  />
                  {creator.availableForWork && (
                    <span
                      className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background shadow-sm"
                      title="Available for freelance"
                    />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <h1 className="text-lg sm:text-xl font-display font-extrabold text-foreground">
                      {creator.fullName}
                    </h1>
                    <span className="text-primary" title="Verified Pro Creator">
                      <Award size={16} />
                    </span>
                  </div>
                  <span className="text-xs font-mono text-primary font-semibold">
                    @{creator.username}
                  </span>
                </div>

                {creator.headline && (
                  <p className="text-xs text-muted-foreground leading-snug">
                    {creator.headline}
                  </p>
                )}

                {creator.availableForWork ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for Work
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
                    Currently Booked
                  </span>
                )}
              </div>

              {/* Action Buttons: Follow & Hire */}
              <div className="flex items-center gap-2 pt-1">
                {isCurrentUser ? (
                  <Link
                    to="/dashboard/settings"
                    className="w-full py-2 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-bold text-center transition-all"
                  >
                    Edit Profile
                  </Link>
                ) : (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleFollow(creator.id)}
                      className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isFollowing
                          ? "border border-border bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(170,255,56,0.3)] hover:opacity-90"
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

                    <a
                      href={`mailto:${creator.username}@designers.gallery?subject=Commission Request`}
                      className="px-4 py-2 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Mail size={13} /> Hire
                    </a>
                  </>
                )}
              </div>

              {/* Behance Creator Stats Grid */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-center">
                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                    Project Views
                  </span>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {(creator.totalViews || 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                    Appreciations
                  </span>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {(creator.totalAppreciations || 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                    Followers
                  </span>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {(creator.followersCount || 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-[10px] font-mono text-muted-foreground block uppercase">
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
                      href={creator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors truncate"
                    >
                      {creator.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>

              {/* Skills & Software */}
              {creator.skills && creator.skills.length > 0 && (
                <div className="pt-3 border-t border-border space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                    Focus Areas & Tools
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {creator.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md border border-primary/20 bg-primary/10 text-primary text-[10px] font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="pt-3 border-t border-border flex items-center justify-center gap-2 text-muted-foreground">
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
                <span>Moodboards ({savedProjects.length})</span>
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
                >
                  {creatorProjects.length === 0 ? (
                    <div className="py-16 text-center text-muted-foreground text-xs">
                      No published projects yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {creatorProjects.map((p) => (
                        <ProjectCard key={p.id} project={p} />
                      ))}
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
                >
                  {savedProjects.length === 0 ? (
                    <div className="py-16 text-center text-muted-foreground text-xs space-y-2">
                      <p>No saved projects in your moodboard.</p>
                      <p className="text-[11px]">Click the bookmark icon on any project to curate it here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {savedProjects.map((p) => (
                        <ProjectCard key={p.id} project={p} />
                      ))}
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
  );
}
