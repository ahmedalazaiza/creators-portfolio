import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Users,
  Search,
  Sparkles,
  MapPin,
  Globe,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn } = useAuth();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-medium">
          <Users size={13} />
          <span>Creators Community</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
          Discover & Connect with Designers
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Explore profiles of UI/UX architects, 3D artists, and visual creatives from around the world.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-xl mx-auto relative flex items-center">
        <Search size={16} className="absolute left-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, skill, or specialty..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
        />
      </div>

      {/* Empty State / Directory Placeholder */}
      <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 sm:p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <UserPlus size={24} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-foreground">
            Creators Network is Initialized
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Registered creators and community members will appear in this directory as new users join the platform.
          </p>
        </div>

        {!isLoggedIn && (
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 cursor-pointer"
          >
            <span>Create Your Creator Profile</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </motion.main>
  );
}
