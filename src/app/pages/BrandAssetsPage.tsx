import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Sparkles, ArrowLeft, Download, Palette, Type, Layers } from "lucide-react";

export default function BrandAssetsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8"
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
          <Sparkles size={14} />
          <span>Brand Identity Kit</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          Brand Assets & Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Official logos, color tokens, and press resources for Portfolios.
        </p>
      </div>

      {/* Brand Kit Cards */}
      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
        {/* Logo Section */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
              <Layers size={18} className="text-slate-900 dark:text-[#CDF22B]" />
              <h2>Primary Wordmark & Symbol</h2>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">SVG Vector</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Light Preview */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#CDF22B] text-slate-900 flex items-center justify-center font-bold">
                <Sparkles size={16} />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Portfolios<span className="text-[#CDF22B]">.</span>
              </span>
            </div>

            {/* Dark Preview */}
            <div className="p-8 rounded-2xl bg-[#070905] border border-white/10 flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#CDF22B] text-slate-900 flex items-center justify-center font-bold">
                <Sparkles size={16} />
              </div>
              <span className="text-lg font-bold text-white">
                Portfolios<span className="text-[#CDF22B]">.</span>
              </span>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <Palette size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>Color Tokens</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <div className="h-16 rounded-xl bg-[#CDF22B] shadow-sm" />
              <div>
                <div className="font-bold text-foreground text-xs">Volt Lime</div>
                <div className="text-[11px] font-mono text-muted-foreground">#CDF22B</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <div className="h-16 rounded-xl bg-[#070905] border border-white/10" />
              <div>
                <div className="font-bold text-foreground text-xs">Obsidian Black</div>
                <div className="text-[11px] font-mono text-muted-foreground">#070905</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <div className="h-16 rounded-xl bg-[#171915] border border-white/10" />
              <div>
                <div className="font-bold text-foreground text-xs">Elevated Surface</div>
                <div className="text-[11px] font-mono text-muted-foreground">#171915</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
              <div className="h-16 rounded-xl bg-gradient-to-r from-[#CDF22B] to-emerald-400" />
              <div>
                <div className="font-bold text-foreground text-xs">Atmospheric Glow</div>
                <div className="text-[11px] font-mono text-muted-foreground">Radial Gradient</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
