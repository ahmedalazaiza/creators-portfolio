import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
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
  LayoutGrid,
  Palette,
  Box,
  Cpu,
  Flame,
  Star,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface DisciplineCard {
  id: string;
  title: string;
  category: string;
  tools: string[];
  image: string;
  highlight: string;
}

const DISCIPLINES: DisciplineCard[] = [
  {
    id: "product-design",
    title: "Product Design & Spatial UX",
    category: "UI/UX & Systems",
    tools: ["Figma", "Design Systems", "Prototyping"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    highlight: "Deep wireframes, user journeys, and component architectures.",
  },
  {
    id: "3d-spatial",
    title: "3D Visuals & Spatial CGI",
    category: "3D & Motion",
    tools: ["Blender", "Cinema 4D", "Octane"],
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    highlight: "High-resolution renders with ray-traced materials and lighting.",
  },
  {
    id: "brand-identity",
    title: "Brand Architecture & Typography",
    category: "Branding",
    tools: ["Art Direction", "Editorial", "Kinetic Type"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
    highlight: "Comprehensive visual systems from concept to real-world applications.",
  },
  {
    id: "creative-tech",
    title: "Creative Tech & Interactive Web",
    category: "Creative Coding",
    tools: ["WebGL", "Three.js", "Canvas"],
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    highlight: "Fluid 120fps browser canvas experiences with zero layout shifts.",
  },
];

export default function AboutPage() {
  const [activeDiscipline, setActiveDiscipline] = useState(0);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-6 pb-24 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 space-y-20"
    >
      {/* ─── Top Sub-Navigation ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Showcase</span>
        </Link>

        <div className="flex items-center gap-2.5 text-xs">
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

      {/* ─── 1. Monumental Hero Section ──────────────────────────────── */}
      <section className="text-center max-w-5xl mx-auto space-y-6 pt-2">
        {/* Sleek Obsidian Badge with High Contrast */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F172A] text-white dark:bg-[#171915] dark:border dark:border-white/15 text-xs font-mono font-bold shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CDF22B] opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CDF22B]" />
          </span>
          <span>The Manifesto & Mission</span>
        </div>

        {/* High-Contrast Monumental Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-[#0F172A] dark:text-white leading-[1.08]">
          A sanctuary for <br className="hidden sm:inline" />
          <span className="relative inline-block mt-1">
            <span className="px-4 py-1 rounded-2xl bg-[#0F172A] text-[#CDF22B] dark:bg-[#CDF22B] dark:text-[#0F172A] shadow-xl inline-block">
              exceptional digital craft.
            </span>
          </span>
        </h1>

        {/* Lead Paragraph in Crisp High-Contrast Slate */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          We built Portfolios to give designers, 3D artists, and creative technologists a calm, uncompromised stage to present deep case studies with high-fidelity craft and zero algorithmic noise.
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/signup"
            className="px-7 py-3 rounded-full btn-primary text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Start Your Portfolio</span>
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/creators"
            className="px-6 py-3 rounded-full btn-secondary text-xs sm:text-sm font-semibold cursor-pointer active:scale-95"
          >
            <span>Explore Creator Directory</span>
          </Link>
        </div>
      </section>

      {/* ─── 2. Executive Bento Metric Bar ────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 space-y-2 relative overflow-hidden group hover:border-[#0F172A]/40 dark:hover:border-[#CDF22B]/60 transition-all shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Curated Works</span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-[#1e231b] flex items-center justify-center text-foreground">
              <Layers size={14} />
            </div>
          </div>
          <p className="text-3xl sm:text-5xl font-black font-display text-[#0F172A] dark:text-white tracking-tight">
            40,000<span className="text-[#CDF22B] dark:text-[#CDF22B] text-2xl font-bold">+</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Case studies curated across 3D, UI/UX, branding & code.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 space-y-2 relative overflow-hidden group hover:border-[#0F172A]/40 dark:hover:border-[#CDF22B]/60 transition-all shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Global Reach</span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-[#1e231b] flex items-center justify-center text-foreground">
              <Globe size={14} />
            </div>
          </div>
          <p className="text-3xl sm:text-5xl font-black font-display text-[#0F172A] dark:text-white tracking-tight">
            180<span className="text-[#CDF22B] dark:text-[#CDF22B] text-2xl font-bold">+</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Countries represented by visionary independent creators.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 space-y-2 relative overflow-hidden group hover:border-[#0F172A]/40 dark:hover:border-[#CDF22B]/60 transition-all shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Studio Discovery</span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-[#1e231b] flex items-center justify-center text-foreground">
              <Eye size={14} />
            </div>
          </div>
          <p className="text-3xl sm:text-5xl font-black font-display text-[#0F172A] dark:text-white tracking-tight">
            2.4M<span className="text-[#CDF22B] dark:text-[#CDF22B] text-2xl font-bold">+</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Monthly impressions by design leads and recruiters.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 space-y-2 relative overflow-hidden group hover:border-[#0F172A]/40 dark:hover:border-[#CDF22B]/60 transition-all shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Algorithmic Noise</span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-[#1e231b] flex items-center justify-center text-foreground">
              <Shield size={14} />
            </div>
          </div>
          <p className="text-3xl sm:text-5xl font-black font-display text-[#0F172A] dark:text-white tracking-tight">
            0<span className="text-[#CDF22B] dark:text-[#CDF22B] text-2xl font-bold">%</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Zero sponsored ads, zero clickbait feeds, 100% pure craft.
          </p>
        </div>
      </section>

      {/* ─── 3. Visual Discipline Showcase (Interactive Preview) ─────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#CDF22B]">
              Disciplines We Celebrate
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A] dark:text-white tracking-tight">
              Built for the Full Spectrum of Creative Practice
            </h2>
          </div>

          <p className="text-xs text-muted-foreground max-w-md">
            Whether you are building design systems, crafting 3D environments, or writing creative shaders, Portfolios provides the ultimate canvas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISCIPLINES.map((item, idx) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 group hover:border-[#0F172A]/50 dark:hover:border-[#CDF22B]/60 transition-all flex flex-col justify-between shadow-xs"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100 dark:bg-[#171915]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#0F172A]/90 text-white text-[10px] font-mono font-bold shadow-md">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold font-display text-[#0F172A] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.highlight}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
                  {item.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1e231b] text-slate-700 dark:text-slate-300 text-[10px] font-mono font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. The Founding Manifesto (Split-Screen Canvas) ──────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: The Narrative */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0F172A] text-[#CDF22B] text-xs font-mono font-bold shadow-xs">
            <span>THE FOUNDING STORY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#0F172A] dark:text-white tracking-tight leading-tight">
            Why we refused to let the case study die.
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              In an era dominated by 3-second social dopamine feeds, true design craft was losing its home. Portfolio platforms pivoted into noisy social networks that rewarded clickbait thumbnails and generic trends instead of deep design rationale.
            </p>
            <p>
              We founded <strong>Portfolios</strong> as a quiet rebellion. A place where creators can articulate the <em>why</em> behind their work: the typography rules, the design systems, the 3D explorations, and the micro-interactions.
            </p>
          </div>

          {/* High-Craft Quote Box */}
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-[#171915] border-l-4 border-[#0F172A] dark:border-[#CDF22B] space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white italic leading-relaxed">
              "Great design isn't just about what looks good in a single crop. It's about systemic thought, restraint, and deliberate craft. That deserves a calm, beautiful stage."
            </p>
            <p className="text-[11px] font-mono text-muted-foreground">
              — Founding Team Manifesto, 2025
            </p>
          </div>
        </div>

        {/* Right Column: 4 Core Platform Pillars */}
        <div className="lg:col-span-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-white/10 space-y-6 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <h3 className="text-base font-bold font-display text-[#0F172A] dark:text-white flex items-center gap-2">
                <Compass size={18} className="text-[#0F172A] dark:text-[#CDF22B]" />
                <span>Our 4 Core Pillars</span>
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground">Guaranteed Standards</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#171915]/90 border border-slate-200/60 dark:border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-[#CDF22B] dark:bg-[#CDF22B] dark:text-[#0F172A] flex items-center justify-center shrink-0 font-bold text-xs">
                  01
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Depth Over Superficial Previews
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    We support comprehensive long-form case studies, full design systems, and rich multimedia without restrictive character limits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#171915]/90 border border-slate-200/60 dark:border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-[#CDF22B] dark:bg-[#CDF22B] dark:text-[#0F172A] flex items-center justify-center shrink-0 font-bold text-xs">
                  02
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Lossless Visual Fidelity
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Retina 4K image pipeline with crisp WebP/AVIF generation, wide gamut color management, and zero aggressive compression.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#171915]/90 border border-slate-200/60 dark:border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-[#CDF22B] dark:bg-[#CDF22B] dark:text-[#0F172A] flex items-center justify-center shrink-0 font-bold text-xs">
                  03
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Zero Pay-to-Win Algorithms
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Discovery is purely chronological and community-curated. No sponsored boosts, no engagement traps, no vanity games.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#171915]/90 border border-slate-200/60 dark:border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-[#CDF22B] dark:bg-[#CDF22B] dark:text-[#0F172A] flex items-center justify-center shrink-0 font-bold text-xs">
                  04
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    100% Creator Sovereignty
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    You retain 100% intellectual property of all artwork. Direct recruiter contact buttons with 0% platform commission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Core Platform Superpowers (Bento Grid) ───────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#CDF22B]">
            Platform Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#0F172A] dark:text-white tracking-tight">
            Engineered for Creators & Studios
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A harmonious balance between aesthetic refinement and modern web infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs hover:border-[#0F172A]/40 dark:hover:border-[#CDF22B]/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#CDF22B] dark:bg-[#CDF22B] dark:text-[#0F172A] flex items-center justify-center font-bold shadow-md">
              <Zap size={22} />
            </div>
            <h3 className="text-base font-bold font-display text-[#0F172A] dark:text-white">
              Sub-50ms Global Edge Speed
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Distributed edge asset delivery ensures your heavy 4K case studies and 3D imagery render instantly for clients in Tokyo, London, or New York.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs hover:border-[#0F172A]/40 dark:hover:border-[#CDF22B]/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#CDF22B] dark:bg-[#CDF22B] dark:text-[#0F172A] flex items-center justify-center font-bold shadow-md">
              <Shield size={22} />
            </div>
            <h3 className="text-base font-bold font-display text-[#0F172A] dark:text-white">
              Zero Ads & Zero Data Profiling
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We never monetize your viewers with intrusive banner ads, tracking pixels, or paywalled profile views. Your portfolio stays pure and professional.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs hover:border-[#0F172A]/40 dark:hover:border-[#CDF22B]/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#CDF22B] dark:bg-[#CDF22B] dark:text-[#0F172A] flex items-center justify-center font-bold shadow-md">
              <Users size={22} />
            </div>
            <h3 className="text-base font-bold font-display text-[#0F172A] dark:text-white">
              High-Signal Peer Network
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A verified community of genuine practitioners. Receive thoughtful appreciations, authentic feedback, and meaningful creative connections.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6. High-Impact Executive CTA Banner ─────────────────────── */}
      <section className="rounded-3xl p-8 sm:p-14 bg-[#0F172A] text-white border border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#CDF22B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#CDF22B] text-xs font-mono font-bold">
            <Sparkles size={13} />
            <span>Join 40,000+ Designers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white leading-tight">
            Ready to give your craft the stage it deserves?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Create your free profile in seconds. Publish unlimited high-fidelity case studies, customize your studio, and connect with visionary clients worldwide.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 pt-2">
          <Link
            to="/signup"
            className="px-8 py-3.5 rounded-full btn-primary text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 text-[#0F172A]"
          >
            <span>Create Your Free Portfolio</span>
            <ArrowRight size={15} />
          </Link>

          <Link
            to="/team"
            className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all cursor-pointer"
          >
            <span>Meet Our Team</span>
          </Link>
        </div>
      </section>
    </motion.main>
  );
}
