import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Eye,
  Heart,
  Globe,
  Award,
  Zap,
  Shield,
  Layers,
  Users,
  Compass,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-8 pb-24 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 space-y-16"
    >
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Showcase</span>
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/team"
            className="px-4 py-1.5 rounded-full btn-secondary text-xs font-semibold"
          >
            Meet the Team
          </Link>
          <Link
            to="/contact"
            className="px-4 py-1.5 rounded-full btn-primary text-xs font-bold"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* ─── Hero Stage ────────────────────────────────────────────── */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-[#171915] text-[#CDF22B] text-xs font-mono font-bold border border-slate-800 dark:border-white/10 shadow-2xs">
          <Sparkles size={14} />
          <span>About Portfolios</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-foreground leading-[1.1]">
          The elevated home for <br className="hidden sm:inline" />
          <span className="text-[#CDF22B]">exceptional digital craft.</span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          We built Portfolios to give designers, 3D artists, and creative technologists a focused, calm platform to present deep case studies with high-fidelity craft and genuine community feedback.
        </p>
      </section>

      {/* ─── Platform Impact & Key Metrics ───────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 text-center space-y-2">
          <p className="text-3xl sm:text-5xl font-bold font-display text-[#CDF22B]">
            40K+
          </p>
          <p className="text-xs font-semibold text-foreground">Curated Case Studies</p>
          <p className="text-[11px] text-muted-foreground">Published worldwide</p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 text-center space-y-2">
          <p className="text-3xl sm:text-5xl font-bold font-display text-foreground">
            180+
          </p>
          <p className="text-xs font-semibold text-foreground">Countries Reached</p>
          <p className="text-[11px] text-muted-foreground">Global creative network</p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 text-center space-y-2">
          <p className="text-3xl sm:text-5xl font-bold font-display text-[#CDF22B]">
            2.4M+
          </p>
          <p className="text-xs font-semibold text-foreground">Monthly Views</p>
          <p className="text-[11px] text-muted-foreground">By hiring teams & studios</p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 text-center space-y-2">
          <p className="text-3xl sm:text-5xl font-bold font-display text-foreground">
            99.9%
          </p>
          <p className="text-xs font-semibold text-foreground">Uptime & Fidelity</p>
          <p className="text-[11px] text-muted-foreground">Fast lossless delivery</p>
        </div>
      </section>

      {/* ─── Our Story & Vision ──────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] text-xs font-bold font-mono">
            OUR STORY
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Why we founded Portfolios
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              Traditional portfolio platforms have become noisy, algorithmic feeds focused on quick likes and generic thumbnails rather than the deep, thoughtful craft of digital product design and creative technology.
            </p>
            <p>
              We wanted to create a calm sanctuary where case studies are honored. A place where creators can articulate the *why*, the design systems, the 3D explorations, and the micro-interactions with zero algorithmic clutter.
            </p>
            <p>
              Today, Portfolios connects forward-thinking designers with world-class agencies, innovative startups, and creative peers globally.
            </p>
          </div>
        </div>

        {/* Visual Card Showcase */}
        <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CDF22B]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <h3 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
            <Compass size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <span>Our Founding Principles</span>
          </h3>

          <ul className="space-y-3.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-[#CDF22B] shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Depth over noise:</strong> We prioritize comprehensive design narratives and full case studies over superficial previews.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-[#CDF22B] shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Lossless visual fidelity:</strong> High-resolution asset rendering with color-managed previews and retina support.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-[#CDF22B] shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Respect creator ownership:</strong> No lock-in, customizable profiles, and direct contact avenues for career opportunities.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-[#CDF22B] shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Universal accessibility:</strong> Open to individual creators, studios, and students worldwide with a free tier forever.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── Core Values Grid ────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Our Core Values
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            The fundamental standards that guide how we design and build our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#CDF22B]/20">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold text-foreground">Speed & Craft</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every millisecond counts. We build lightning-fast experiences that allow your high-resolution case studies to load instantly anywhere in the world.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#CDF22B]/20">
              <Shield size={20} />
            </div>
            <h3 className="text-base font-bold text-foreground">Integrity & Privacy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We never sell your data or inject disruptive ads into your portfolio. Your work belongs to you, and your audience enjoys an uncluttered showcase.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#CDF22B]/20">
              <Users size={20} />
            </div>
            <h3 className="text-base font-bold text-foreground">Community First</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Constructive feedback, genuine appreciations, and peer collaboration over vanity metrics. We cultivate a respectful community of true practitioners.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA Banner ───────────────────────────────────────── */}
      <section className="glass-card rounded-3xl p-8 sm:p-14 border border-slate-200/80 dark:border-white/10 text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Ready to showcase your craft?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Join thousands of visionary creators presenting design systems, 3D explorations, and product masterworks on Portfolios.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-full btn-primary text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Create Your Free Portfolio</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/creators"
            className="px-6 py-3 rounded-full bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 hover:bg-slate-200 text-foreground text-xs font-semibold"
          >
            Explore Creators
          </Link>
        </div>
      </section>
    </motion.main>
  );
}
