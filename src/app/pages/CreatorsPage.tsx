import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Users,
  Search,
  Sparkles,
  MapPin,
  Globe,
  ArrowRight,
  UserPlus,
  UserCheck,
  Heart,
  Grid,
  Check,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { useSocial } from "../hooks/useSocial";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { Profile } from "../types";

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isLoggedIn } = useAuth();
  const { allProjects } = useProjects();
  const { isFollowing, toggleFollow, getFollowersCount } = useSocial(user?.id);
  const navigate = useNavigate();

  const [dbCreators, setDbCreators] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real creators from Supabase
  useEffect(() => {
    const fetchCreators = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped: Profile[] = data.map((p: any) => ({
            id: p.id,
            username: p.username,
            fullName: p.full_name || p.fullName || "Creative Member",
            headline: p.headline || "Digital Product Designer",
            bio: p.bio || "Creator on Portfolios",
            avatarUrl:
              p.avatar_url ||
              p.avatarUrl ||
              `https://api.dicebear.com/7.x/shapes/svg?seed=${p.username || "creator"}`,
            bannerUrl:
              p.banner_url ||
              p.bannerUrl ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
            location: p.location || "Global",
            website: p.website,
            availableForWork: p.available_for_work ?? true,
            skills: p.skills || [],
            socialLinks: p.social_links || {},
            followersCount: p.followers_count || 0,
            followingCount: p.following_count || 0,
            totalAppreciations: p.total_appreciations || 0,
            totalViews: p.total_views || 0,
            isFollowing: false,
            createdAt: p.created_at || new Date().toISOString(),
          }));
          setDbCreators(mapped);
        }
      } catch (err) {
        console.warn("Supabase fetch creators error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  // Filter creators by search query
  const filteredCreators = useMemo(() => {
    if (!searchQuery.trim()) return dbCreators;
    const q = searchQuery.toLowerCase();
    return dbCreators.filter((c) => {
      const matchName = c.fullName.toLowerCase().includes(q);
      const matchUsername = c.username.toLowerCase().includes(q);
      const matchHeadline = c.headline?.toLowerCase().includes(q) || false;
      const matchSkills = c.skills?.some((s) => s.toLowerCase().includes(q)) || false;
      const matchLocation = c.location?.toLowerCase().includes(q) || false;
      return matchName || matchUsername || matchHeadline || matchSkills || matchLocation;
    });
  }, [dbCreators, searchQuery]);

  const handleFollow = async (e: React.MouseEvent, creator: Profile) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/creators" } });
      return;
    }

    if (user?.id === creator.id || user?.username?.toLowerCase() === creator.username.toLowerCase()) {
      return;
    }

    await toggleFollow(
      {
        id: creator.id,
        username: creator.username,
        followersCount: creator.followersCount,
      },
      user?.id
    );
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-6 pb-20 max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-10 space-y-8"
    >
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-[#171915] text-[#CDF22B] text-xs font-mono font-bold border border-slate-800 dark:border-white/10 shadow-2xs">
          <Users size={13} />
          <span>Creators Network</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
          Discover & Connect with Designers
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Follow pioneering UI/UX architects, 3D artists, type designers, and creative directors.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-xl mx-auto relative flex items-center">
        <Search size={16} className="absolute left-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators by name, discipline, or skill..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl glass-card border border-slate-200/80 dark:border-white/10 text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#CDF22B]/30 focus:border-[#CDF22B] shadow-sm transition-all"
        />
      </div>

      {/* Creators Grid / Loading / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between"
            >
              <div className="h-28 bg-slate-200 dark:bg-[#171915]" />
              <div className="p-6 -mt-10 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-300 dark:bg-[#1e231b] border-2 border-background" />
                <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-md w-32" />
                <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-48" />
                <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-24" />
              </div>
              <div className="px-6 py-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-20" />
                <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCreators.map((creator) => {
            const isSelf =
              user &&
              (user.id === creator.id ||
                user.username?.toLowerCase() === creator.username.toLowerCase());
            const following = isFollowing(creator.id || creator.username);
            const liveFollowers = getFollowersCount(
              creator.id || creator.username,
              creator.followersCount
            );

            // Count creator's projects
            const creatorProjectsCount = allProjects.filter(
              (p) =>
                p.userId === creator.id ||
                p.creator?.username?.toLowerCase() === creator.username.toLowerCase()
            ).length;

            return (
              <motion.div
                key={creator.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-xl hover:border-[#CDF22B]/60 transition-all flex flex-col justify-between"
              >
                {/* Creator Header Banner & Avatar */}
                <div>
                  <div className="h-28 w-full bg-slate-900 relative overflow-hidden">
                    <img
                      src={creator.bannerUrl}
                      alt={`${creator.fullName} banner`}
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  </div>

                  <div className="px-6 -mt-10 relative z-10 flex items-end justify-between">
                    <div className="relative">
                      <img
                        src={creator.avatarUrl}
                        alt={creator.fullName}
                        className="w-18 h-18 rounded-2xl object-cover bg-slate-100 dark:bg-[#171915] border-2 border-background shadow-lg"
                      />
                      {creator.availableForWork && (
                        <span
                          title="Available for work"
                          className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-white"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        </span>
                      )}
                    </div>

                    {!isSelf && (
                      <button
                        onClick={(e) => handleFollow(e, creator)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 ${
                          following
                            ? "btn-secondary hover:bg-rose-500 hover:text-white hover:border-rose-500"
                            : "btn-primary text-slate-950"
                        }`}
                      >
                        {following ? (
                          <>
                            <UserCheck size={13} />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={13} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Creator Info */}
                  <div className="p-6 space-y-3">
                    <div>
                      <Link
                        to={`/@${creator.username}`}
                        className="text-base font-bold font-display text-foreground hover:text-slate-900 dark:hover:text-[#CDF22B] transition-colors block"
                      >
                        {creator.fullName}
                      </Link>
                      <p className="text-xs text-slate-900 dark:text-[#CDF22B] font-mono font-semibold">
                        @{creator.username}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {creator.headline}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {creator.bio}
                    </p>

                    {/* Skills pills */}
                    {creator.skills && creator.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {creator.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#1e231b] text-[10px] font-semibold text-foreground border border-slate-200 dark:border-white/10"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="px-6 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-[#070905]/40 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Grid size={12} /> {creatorProjectsCount} Works
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {liveFollowers} Followers
                    </span>
                  </div>

                  <Link
                    to={`/@${creator.username}`}
                    className="font-bold text-foreground hover:text-slate-900 dark:hover:text-[#CDF22B] flex items-center gap-1 transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-12 sm:p-16 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#171915] text-muted-foreground flex items-center justify-center mx-auto">
            <Users size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {searchQuery ? "No Matching Creators" : "No Creators Registered Yet"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? `No designer matches "${searchQuery}".`
                : "Create your portfolio account to be the pioneer creator on the platform."}
            </p>
          </div>
          {!isLoggedIn && (
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Join Creators Network</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
    </motion.main>
  );
}
