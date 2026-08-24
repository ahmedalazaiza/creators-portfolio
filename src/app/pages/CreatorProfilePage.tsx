import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  User,
  Plus,
  Grid,
  Bookmark,
  MapPin,
  Globe,
  Share2,
  Sparkles,
  ArrowLeft,
  UserPlus,
  UserCheck,
  Mail,
  Check,
  Heart,
  Settings,
  Edit3,
  ExternalLink,
  Twitter,
  Dribbble,
  Linkedin,
  Github,
  Instagram,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { useSocial } from "../hooks/useSocial";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { Profile, Project } from "../types";
import ProjectCard from "../components/ProjectCard";
import EditProfileModal from "../components/EditProfileModal";

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user, isLoggedIn } = useAuth();
  const { allProjects } = useProjects();
  const { isFollowing, toggleFollow, getFollowersCount } = useSocial(user?.id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"projects" | "about" | "saved">("projects");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Live Supabase state
  const [dbProfile, setDbProfile] = useState<Profile | null>(null);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const cleanUsername = username ? username.replace(/^@/, "").toLowerCase() : "";

  // Check if viewing own profile
  const isOwnProfile =
    !username ||
    (user && (user.username?.toLowerCase() === cleanUsername || user.id === username));

  // Fetch real profile and projects from Supabase
  useEffect(() => {
    const fetchCreatorData = async () => {
      // If viewing own profile and user exists
      if (isOwnProfile && user) {
        setDbProfile(user as any);
        setLoading(false);
        return;
      }

      if (!cleanUsername) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setNotFound(false);

      try {
        // 1. Fetch Profile from Supabase
        const { data: profileData, error: profileErr } = await supabase
          .from("profiles")
          .select("*")
          .or(`username.ilike.${cleanUsername},id.eq.${cleanUsername}`)
          .maybeSingle();

        if (profileErr || !profileData) {
          setNotFound(true);
          setDbProfile(null);
        } else {
          const mappedProfile: Profile = {
            id: profileData.id,
            username: profileData.username,
            fullName: profileData.full_name || profileData.fullName || "Creative Member",
            headline: profileData.headline || "Digital Creative & Designer",
            bio: profileData.bio || "Creator on Portfolios.",
            avatarUrl:
              profileData.avatar_url ||
              profileData.avatarUrl ||
              `https://api.dicebear.com/7.x/shapes/svg?seed=${profileData.username}`,
            bannerUrl:
              profileData.banner_url ||
              profileData.bannerUrl ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
            location: profileData.location,
            website: profileData.website,
            availableForWork: profileData.available_for_work ?? true,
            skills: profileData.skills || [],
            socialLinks: profileData.social_links || {},
            followersCount: profileData.followers_count || 0,
            followingCount: profileData.following_count || 0,
            totalAppreciations: profileData.total_appreciations || 0,
            totalViews: profileData.total_views || 0,
            isFollowing: false,
            createdAt: profileData.created_at || new Date().toISOString(),
          };
          setDbProfile(mappedProfile);

          // 2. Fetch Creator's published projects from Supabase
          const { data: projectsData, error: projectsErr } = await supabase
            .from("projects")
            .select("*, creator:profiles(*)")
            .eq("user_id", profileData.id)
            .order("created_at", { ascending: false });

          if (!projectsErr && projectsData) {
            const mapped = projectsData.map((p: any) => ({
              id: p.id,
              userId: p.user_id,
              title: p.title,
              slug: p.slug || p.id,
              description: p.description,
              fullDescription: p.full_description,
              category: p.category,
              categoryId: p.category_id,
              coverImage: p.cover_image,
              accentColor: p.accent_color || "#CDF22B",
              year: p.year || "2025",
              tools: p.tools || [],
              tags: p.tags || [],
              images: p.images || [],
              contentBlocks: p.content_blocks || [],
              isFeatured: p.is_featured || false,
              isAppreciated: false,
              isSaved: false,
              viewsCount: p.views_count || 0,
              appreciationsCount: p.appreciations_count || 0,
              createdAt: p.created_at,
              updatedAt: p.updated_at,
              creator: {
                id: profileData.id,
                username: profileData.username,
                fullName: profileData.full_name || profileData.fullName || "Creative Member",
                avatarUrl: profileData.avatar_url || profileData.avatarUrl,
                headline: profileData.headline,
                bio: profileData.bio,
                location: profileData.location,
                website: profileData.website,
                skills: profileData.skills || [],
              },
            }));
            setDbProjects(mapped);
          }
        }
      } catch (err) {
        console.warn("Error loading creator from Supabase:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [cleanUsername, isOwnProfile, user]);

  // Resolved Creator Profile Object
  const profile = useMemo(() => {
    if (isOwnProfile && user) {
      return {
        id: user.id,
        fullName: user.fullName || "Creative Member",
        username: user.username || "creator",
        avatarUrl:
          user.avatarUrl ||
          `https://api.dicebear.com/7.x/shapes/svg?seed=${user.username || "user"}`,
        bannerUrl:
          user.bannerUrl ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        headline: user.headline || "Digital Product & Visual Designer",
        bio:
          user.bio ||
          "Passionate creator exploring digital design systems, user experiences, and visual craft.",
        location: user.location || "Global",
        website: user.website || "https://portfolios.space",
        availableForWork: user.availableForWork ?? true,
        skills: user.skills || [],
        socialLinks: user.socialLinks || {},
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
      };
    }

    if (dbProfile) {
      return {
        id: dbProfile.id,
        fullName: dbProfile.fullName,
        username: dbProfile.username,
        avatarUrl:
          dbProfile.avatarUrl ||
          `https://api.dicebear.com/7.x/shapes/svg?seed=${dbProfile.username}`,
        bannerUrl:
          dbProfile.bannerUrl ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        headline: dbProfile.headline || "Digital Creative & Visual Artist",
        bio: dbProfile.bio || "Crafting elevated visual experiences and design systems.",
        location: dbProfile.location || "Global",
        website: dbProfile.website || "https://portfolios.space",
        availableForWork: dbProfile.availableForWork ?? true,
        skills: dbProfile.skills || [],
        socialLinks: dbProfile.socialLinks || {},
        followersCount: dbProfile.followersCount || 0,
        followingCount: dbProfile.followingCount || 0,
      };
    }

    return null;
  }, [isOwnProfile, user, dbProfile]);

  // Projects published by this creator
  const creatorProjects = useMemo(() => {
    if (dbProjects.length > 0) return dbProjects;

    if (profile) {
      return allProjects.filter(
        (p) =>
          p.userId === profile.id ||
          p.creator?.username?.toLowerCase() === profile.username.toLowerCase()
      );
    }

    return [];
  }, [allProjects, dbProjects, profile]);

  // Saved / Appreciated projects
  const savedProjects = useMemo(() => {
    return allProjects.filter((p) => Boolean(p.isSaved));
  }, [allProjects]);

  // Live Followers & Follow State
  const following = profile ? isFollowing(profile.id || profile.username) : false;
  const liveFollowersCount = profile
    ? getFollowersCount(profile.id || profile.username, profile.followersCount)
    : 0;

  // Total Appreciations received across creator's projects
  const totalAppreciations = useMemo(() => {
    return creatorProjects.reduce((sum, p) => sum + (p.appreciationsCount || 0), 0);
  }, [creatorProjects]);

  const handleFollowToggle = async () => {
    if (!profile) return;

    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/@${profile.username}` } });
      return;
    }

    if (isOwnProfile) return;

    setFollowLoading(true);
    await toggleFollow(
      {
        id: profile.id,
        username: profile.username,
        followersCount: profile.followersCount,
      },
      user?.id
    );
    setFollowLoading(false);
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-[#CDF22B]" />
        <p className="text-xs text-muted-foreground">Loading creator portfolio...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-md space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">Creator Not Found</h2>
            <p className="text-xs text-muted-foreground">
              The portfolio profile for "@{cleanUsername}" does not exist or may have been removed.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/creators"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
            >
              <Users size={14} />
              <span>Browse Creators</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground text-xs font-semibold hover:bg-slate-200"
            >
              <ArrowLeft size={14} />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-4 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* ─── 1. Hero Cover Banner & Profile Card ──────────────────────── */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md relative">
        {/* Cover Banner Image */}
        <div className="relative h-44 sm:h-60 w-full overflow-hidden bg-slate-900">
          <img
            src={profile.bannerUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />
        </div>

        {/* Profile Info Overlay Container */}
        <div className="p-6 sm:p-10 -mt-16 sm:-mt-20 relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            {/* Avatar & Identifiers */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover bg-slate-100 dark:bg-slate-800 shadow-2xl border-4 border-background shrink-0"
                />
                {profile.availableForWork && (
                  <span
                    title="Available for hire"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-white shadow-md"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
                    {profile.fullName}
                  </h1>
                  {profile.availableForWork && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                      Available for Work
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-900 dark:text-[#CDF22B] font-mono font-semibold">
                  @{profile.username}
                </p>

                <p className="text-xs text-muted-foreground max-w-lg pt-0.5">
                  {profile.headline}
                </p>
              </div>
            </div>

            {/* Top Action Buttons (Follow, Edit, Share) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="px-5 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Edit3 size={14} />
                    <span>Edit Profile</span>
                  </button>

                  <Link
                    to="/create"
                    className="px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-foreground text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>New Project</span>
                  </Link>

                  <Link
                    to="/settings"
                    aria-label="Settings"
                    className="p-2.5 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Settings size={15} />
                  </Link>
                </>
              ) : (
                <>
                  {/* Follow Button */}
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                      following
                        ? "bg-slate-200 dark:bg-slate-800 text-foreground hover:bg-rose-500 hover:text-white"
                        : "btn-primary text-slate-950"
                    }`}
                  >
                    {following ? (
                      <>
                        <UserCheck size={14} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  {/* Hire / Inquire Button */}
                  <a
                    href={`mailto:hello@${profile.username}.design?subject=Project Inquiry via Portfolios`}
                    className="px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-foreground text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Mail size={14} />
                    <span>Contact</span>
                  </a>

                  {/* Share Profile */}
                  <button
                    onClick={handleShareProfile}
                    aria-label="Share profile link"
                    className="p-2.5 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio & Details Snippet */}
          <div className="space-y-4 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {profile.bio}
            </p>

            {/* Metadata Pills & Social Links */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#CDF22B]" /> {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <Globe size={13} className="text-[#CDF22B]" /> {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>

              {/* Social Icons */}
              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  {profile.socialLinks.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500"
                    >
                      <Twitter size={14} />
                    </a>
                  )}
                  {profile.socialLinks.dribbble && (
                    <a
                      href={profile.socialLinks.dribbble}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-500"
                    >
                      <Dribbble size={14} />
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                    >
                      <Github size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Skills Pills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ─── 4 Statistics Metrics Bar ──────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-center">
              <p className="text-lg sm:text-2xl font-bold font-display text-foreground">
                {creatorProjects.length}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Projects</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-center">
              <p className="text-lg sm:text-2xl font-bold font-display text-foreground flex items-center justify-center gap-1.5">
                <Heart size={16} className="text-slate-900 dark:text-[#CDF22B] fill-current" />
                <span>{totalAppreciations}</span>
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Appreciations</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-center">
              <p className="text-lg sm:text-2xl font-bold font-display text-foreground">
                {liveFollowersCount}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Followers</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-center">
              <p className="text-lg sm:text-2xl font-bold font-display text-foreground">
                {profile.followingCount}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Profile Tabs Navigation ───────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "projects"
              ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Grid size={14} />
          <span>Case Studies ({creatorProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "about"
              ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <User size={14} />
          <span>About Creator</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "saved"
                ? "bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark size={14} />
            <span>Saved Favorites ({savedProjects.length})</span>
          </button>
        )}
      </div>

      {/* ─── 3. Tab Contents ─────────────────────────────────────────── */}
      <div className="min-h-[350px]">
        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            {creatorProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {creatorProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 sm:p-16 text-center space-y-4 border border-slate-200/80 dark:border-slate-800/80 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-muted-foreground flex items-center justify-center mx-auto">
                  <Grid size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">No Projects Published Yet</h3>
                  <p className="text-xs text-muted-foreground">
                    {isOwnProfile
                      ? "Start publishing your creative case studies and design systems to build your audience."
                      : "This creator hasn't published any public case studies yet."}
                  </p>
                </div>
                {isOwnProfile && (
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Upload First Project</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-5">
              <h3 className="text-base font-bold text-foreground">Biography & Creative Focus</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>

              {profile.skills && profile.skills.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Core Disciplines & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-foreground border border-slate-200 dark:border-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-5 h-fit">
              <h3 className="text-base font-bold text-foreground">Contact & Channels</h3>
              <div className="space-y-3 text-xs">
                {profile.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} className="text-[#CDF22B]" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe size={14} className="text-[#CDF22B]" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground hover:underline truncate"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={14} className="text-[#CDF22B]" />
                  <span>Direct inquiries open</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Favorites Tab */}
        {activeTab === "saved" && isOwnProfile && (
          <div>
            {savedProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {savedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 dark:border-slate-800/80 max-w-lg mx-auto">
                <Bookmark size={24} className="text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">No saved favorites yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── 4. Interactive Profile Edit Modal ───────────────────────── */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </motion.main>
  );
}
