import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Cookie, ArrowLeft, CheckCircle, Sliders, ShieldCheck } from "lucide-react";

export default function CookiePolicyPage() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-8 pb-24 px-3 sm:px-6 lg:px-10 max-w-5xl mx-auto space-y-8"
    >
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Showcase</span>
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-[#171915] text-[#CDF22B] text-xs font-bold border border-slate-800 dark:border-white/10 shadow-2xs">
          <Cookie size={14} />
          <span>Transparency & Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          Cookie & Storage Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage how Portfolios uses local storage and cookies to remember your preferences and themes.
        </p>
      </div>

      {/* Preferences Cards */}
      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
        {/* Essential Storage */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
              <ShieldCheck size={18} className="text-slate-900 dark:text-[#CDF22B]" />
              <h2>Essential Local Storage (Required)</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              Always Active
            </span>
          </div>
          <p>
            Necessary for keeping you authenticated, preserving your dark/light theme choice, caching published drafts in Creator Studio, and remembering your filter settings.
          </p>
        </div>

        {/* Analytics Toggle */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
              <Sliders size={18} className="text-slate-900 dark:text-[#CDF22B]" />
              <h2>Anonymous Performance Telemetry</h2>
            </div>
            <button
              onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                analyticsEnabled ? "bg-[#CDF22B]" : "bg-slate-300 dark:bg-[#1e231b]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white dark:bg-[#171915] absolute top-0.5 transition-transform ${
                  analyticsEnabled ? "left-6.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
          <p>
            Anonymized metrics to help us detect slow network speeds, image load times, and platform uptime. No personal identity is ever tracked or sold.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
          <button
            onClick={handleSavePreferences}
            className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-transform"
          >
            Save Preferences
          </button>
          {saved && (
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle size={14} /> Saved successfully
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
