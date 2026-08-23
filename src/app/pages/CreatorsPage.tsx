import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Users,
  Search,
  Sparkles,
  MapPin,
  Globe,
  Award,
  UserPlus,
  UserCheck,
  Mail,
  ArrowUpRight,
  Eye,
  Heart,
  Grid,
  Check,
  Briefcase,
  Flame,
} from "lucide-react";
import { useCreator } from "../hooks/useCreator";
import { useProjects } from "../hooks/useProjects";
import { CATEGORIES } from "../data/categories";

export default function CreatorsPage() {
  const { allCreators, toggleFollow } = useCreator();
  const { allProjects } = useProjects();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredCreators = useMemo(() => {
    return allCreators.filter((creator) => {
      if (onlyAvailable && !creator.availableForWork) return false;

      if (selectedDiscipline !== "all") {
        const matchesSkill = creator.skills?.some(
          (s) =>
            s.toLowerCase().includes(selectedDiscipline.toLowerCase()) ||
            selectedDiscipline.toLowerCase().includes(s.toLowerCase())
        );
        const matchesHeadline = creator.headline
          ?.toLowerCase()
          .includes(selectedDiscipline.toLowerCase());

        if (!matchesSkill && !matchesHeadline) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = creator.fullName.toLowerCase().includes(q);
        const matchesUsername = creator.username.toLowerCase().includes(q);
        const matchesHeadline = creator.headline?.toLowerCase().includes(q);
        const matchesLocation = creator.location?.toLowerCase().includes(q);
        const matchesSkill = creator.skills?.some((s) => s.toLowerCase().includes(q));

        if (!matchesName && !matchesUsername && !matchesHeadline && !matchesLocation && !matchesSkill) {
          return false;
        }
      }

      return true;
    });
  }, [allCreators, searchQuery, selectedDiscipline, onlyAvailable]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14 sm:pt-16 pb-20 bg-background"
    >
      {/* Hero Header Stage */}
      <section className="relative overflow-hidden pt-8 pb-10 border-b border-border/40 bg-gradient-to-b from-[#1E45FB]/10 via-background to-background">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1E45FB]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CDF22B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-mono font-bold">
            <Users size={12} />
            <span>Discover Elite Global Talent</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-foreground tracking-tight">
            Visionary Creators <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E45FB] via-foreground to-[#CDF22B]">
              Leading Global Design
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Follow the world's most accomplished UI/UX architects, 3D CGI directors, branding studios, and creative developers.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-4 text-primary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by creator name, skills, software, location..."
                className="w-full pl-11 pr-24 py-2.5 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs shadow-md focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-[11px] font-mono text-muted-foreground hover:text-foreground px-2 py-0.5 bg-muted rounded-md cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Discipline Row */}
      <section className="py-4 border-b border-border/40 bg-card/20 sticky top-14 sm:top-16 z-20 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          {/* Discipline Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedDiscipline("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDiscipline === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              All Disciplines
            </button>
            {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
              const isSelected = selectedDiscipline === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDiscipline(cat.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Availability Toggle */}
          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              onlyAvailable
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyAvailable ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"}`} />
            <span>Available for Work Only</span>
          </button>
        </div>
      </section>

      {/* Creators Grid */}
      <section className="pt-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-muted-foreground">
            Showing <strong className="text-foreground">{filteredCreators.length}</strong> visionary designers
          </span>
        </div>

        {filteredCreators.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto text-muted-foreground">
              <Users size={20} />
            </div>
            <h3 className="text-base font-bold text-foreground">No creators found</h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search query or discipline filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDiscipline("all");
                setOnlyAvailable(false);
              }}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => {
              const following = creator.isFollowing;
              const creatorWorks = allProjects
                .filter(
                  (p) =>
                    p.userId === creator.id || p.creator?.username === creator.username
                )
                .slice(0, 3);

              return (
                <div
                  key={creator.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  {/* Top Creator Info Bar */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Avatar + Info */}
                      <Link
                        to={`/@${creator.username}`}
                        className="flex items-center gap-3 min-w-0 group"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={creator.avatarUrl}
                            alt={creator.fullName}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-border group-hover:border-primary transition-all"
                          />
                          {creator.availableForWork && (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background"
                              title="Available for freelance"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {creator.fullName}
                            </h3>
                            <Award size={13} className="text-primary shrink-0" />
                          </div>
                          <span className="text-[11px] font-mono text-primary font-semibold block truncate">
                            @{creator.username}
                          </span>
                          {creator.location && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                              <MapPin size={10} /> {creator.location}
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Follow Button */}
                      <button
                        onClick={() => toggleFollow(creator.id)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          following
                            ? "bg-muted text-muted-foreground border border-border"
                            : "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                        }`}
                      >
                        {following ? (
                          <>
                            <UserCheck size={12} /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={12} /> Follow
                          </>
                        )}
                      </button>
                    </div>

                    {/* Headline */}
                    {creator.headline && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {creator.headline}
                      </p>
                    )}

                    {/* Skills Badges */}
                    {creator.skills && creator.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {creator.skills.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md border border-primary/20 bg-primary/10 text-primary text-[10px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Portfolio Preview Strip (Latest 3 Thumbnails) */}
                  <div className="p-3 bg-muted/20 border-t border-border space-y-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-bold">
                      Recent Masterworks
                    </span>

                    {creatorWorks.length === 0 ? (
                      <div className="h-16 flex items-center justify-center text-[11px] text-muted-foreground">
                        No projects uploaded yet
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {creatorWorks.map((work) => (
                          <Link
                            key={work.id}
                            to={`/project/${work.slug || work.id}`}
                            className="aspect-[4/3] rounded-lg overflow-hidden bg-muted relative group/work border border-border hover:border-primary transition-all"
                          >
                            <img
                              src={work.coverImage}
                              alt={work.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover/work:scale-110"
                            />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Footer Row */}
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground text-[11px] font-mono">
                        <span className="flex items-center gap-1">
                          <Eye size={11} /> {(creator.totalViews || 1200).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={11} className="text-rose-500" /> {(creator.totalAppreciations || 340).toLocaleString()}
                        </span>
                      </div>

                      <Link
                        to={`/@${creator.username}`}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        View Profile <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </motion.main>
  );
}
