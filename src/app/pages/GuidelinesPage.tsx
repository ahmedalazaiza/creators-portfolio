import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Compass, ArrowLeft, Sparkles, Image, CheckCircle, Lightbulb } from "lucide-react";

export default function GuidelinesPage() {
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
          <Sparkles size={14} />
          <span>Curatorial Standards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          Showcase & Quality Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          How to get featured on the curated frontpage and elevate your creative case studies.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <Image size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>1. Image Resolution & Visual Craft</h2>
          </div>
          <ul className="space-y-2 list-disc pl-5">
            <li>Upload cover images with a minimum aspect ratio width of 1920px (WebP or PNG).</li>
            <li>Avoid heavy watermarks across focal points; subtle signature tags in the corner are welcome.</li>
            <li>Show in-depth case study breakdowns: include wireframes, color palettes, and production WIP renders.</li>
          </ul>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <CheckCircle size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>2. Curatorial Curation Criteria</h2>
          </div>
          <p>
            Our curatorial team reviews every public project. Works demonstrating exceptional typography, thoughtful design systems, innovative 3D lighting, and clear problem-solving narratives are promoted to the featured hero and discipline spotlight carousels.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <Lightbulb size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>3. Multi-Disciplinary Tags & Tools</h2>
          </div>
          <p>
            Always tag the software and tools used (e.g. Figma, Blender, Cinema 4D, Cinema 4D, Midjourney). Accurate tagging ensures your case studies appear in relevant software filters when creative directors search for specialized talent.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
