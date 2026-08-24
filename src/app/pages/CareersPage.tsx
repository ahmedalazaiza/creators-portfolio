import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Globe,
  Heart,
  Zap,
  Coffee,
  Laptop,
  CheckCircle2,
  DollarSign,
  Calendar,
  X,
  Send,
  Loader2,
  User,
  Mail,
  Link2,
  MessageSquare,
} from "lucide-react";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
}

const OPEN_ROLES: JobOpening[] = [
  {
    id: "lead-product-designer",
    title: "Lead Product Designer (Design Systems)",
    department: "Design",
    type: "Full-Time",
    location: "Remote (Global)",
    description: "Architect the next evolution of our creator canvas, discovery feed, and high-fidelity portfolio presentation surfaces.",
    requirements: [
      "5+ years crafting modern web/mobile design systems in Figma",
      "Obsessive attention to micro-animations and spatial UI layouts",
      "Deep understanding of accessibility, dark-mode ergonomics, and typography",
    ],
  },
  {
    id: "senior-frontend-engineer",
    title: "Senior Frontend Engineer (React / Canvas / WebGL)",
    department: "Engineering",
    type: "Full-Time",
    location: "Remote (Global)",
    description: "Build ultra-performant, 120fps client-side rendering engines for rich imagery, 3D viewport embeds, and fluid case study transitions.",
    requirements: [
      "4+ years with React, TypeScript, TailwindCSS, and Framer Motion",
      "Experience optimizing Core Web Vitals and large media pipelines",
      "Passion for building sleek, joyful user interfaces",
    ],
  },
  {
    id: "community-curation-lead",
    title: "Community Curator & Editorial Lead",
    department: "Curation & Editorial",
    type: "Full-Time",
    location: "Remote (Europe / Americas / MENA)",
    description: "Discover breakthrough case studies across 3D, branding, architecture, and UI/UX to feature in our curated weekly showcase.",
    requirements: [
      "Strong background in graphic design, digital product, or art direction",
      "Existing connections with international design schools and agencies",
      "Excellent storytelling and editorial copywriting skills",
    ],
  },
  {
    id: "backend-infra-engineer",
    title: "Senior Backend / Cloud Infrastructure Engineer",
    department: "Engineering",
    type: "Full-Time",
    location: "Remote (Global)",
    description: "Scale our distributed database cluster, edge asset caching networks, and real-time community engagement microservices.",
    requirements: [
      "Strong experience with PostgreSQL, Supabase/Go/Node, and Edge workers",
      "Expertise in secure Auth protocols and low-latency storage pipelines",
      "Proven track record scaling consumer web platforms to millions of users",
    ],
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [applicantNote, setApplicantNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim() || !portfolioLink.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#CDF22B", "#0F172A", "#FFFFFF"],
      });
    }, 800);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setSubmitted(false);
    setApplicantName("");
    setApplicantEmail("");
    setPortfolioLink("");
    setApplicantNote("");
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pt-8 pb-24 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 space-y-16"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>About Us</span>
        </Link>

        <Link
          to="/team"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full btn-secondary text-xs font-semibold"
        >
          <span>Meet the Team</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-[#171915] text-[#CDF22B] text-xs font-mono font-bold border border-slate-800 dark:border-white/10 shadow-2xs">
          <Briefcase size={13} />
          <span>Join Our Mission</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          Build the Stage for World-Class Creators
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          We are a fully remote, design-obsessed team creating a sanctuary for exceptional case studies and craft. Come shape the future of creative portfolios.
        </p>
      </section>

      {/* Culture & Perks Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#CDF22B]/20">
            <Globe size={18} />
          </div>
          <h3 className="text-sm font-bold text-foreground">100% Remote & Async</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Work from wherever you are most inspired. We value deep work and outcomes over desk hours and unnecessary meetings.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#CDF22B]/20">
            <Laptop size={18} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Top-Tier Hardware & Gear</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every team member receives the latest MacBook Pro / workstation, 4K displays, and premium software licenses of choice.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#CDF22B]/20">
            <Sparkles size={18} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Creative & Learning Stipend</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            $2,500 annual budget for design conferences, masterclasses, books, 3D asset packs, and creative tools.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#CDF22B]/20">
            <Coffee size={18} />
          </div>
          <h3 className="text-sm font-bold text-foreground">Flexible Time Off & Retreats</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unlimited PTO with mandatory minimums, plus twice-yearly international team retreats in inspiring design cities.
          </p>
        </div>
      </section>

      {/* Open Roles Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
              Open Positions ({OPEN_ROLES.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore opportunities to make a profound impact on digital design.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {OPEN_ROLES.map((job) => (
            <div
              key={job.id}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-[#CDF22B]/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] text-[10px] font-bold font-mono">
                    {job.department}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    • {job.type} • {job.location}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {job.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                  {job.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md self-start md:self-auto cursor-pointer shrink-0"
              >
                Apply for Role
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#151813] border border-slate-300 dark:border-white/15 rounded-[32px] overflow-hidden z-10 flex flex-col my-auto"
            >
              {/* Header */}
              <div className="p-6 sm:p-7 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#11130e] flex items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 uppercase">
                      Application
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {selectedJob.department} • {selectedJob.location}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-foreground leading-snug">
                    {selectedJob.title}
                  </h3>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {submitted ? (
                <div className="p-8 sm:p-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center mx-auto border border-[#CDF22B]/30">
                    <CheckCircle2 size={28} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-foreground">
                      Application Submitted!
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong className="text-foreground">{applicantName}</strong>! Our recruitment lead will review your portfolio and reach out to <span className="text-foreground underline">{applicantEmail}</span> within 5 business days.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold cursor-pointer"
                    >
                      Done & Back to Careers
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApply} className="p-6 sm:p-7 space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground flex items-center gap-1.5">
                      <User size={13} className="text-muted-foreground" />
                      <span>Your Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Leo DaVinci"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground flex items-center gap-1.5">
                      <Mail size={13} className="text-muted-foreground" />
                      <span>Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="leo@design.studio"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground flex items-center gap-1.5">
                      <Link2 size={13} className="text-muted-foreground" />
                      <span>Portfolio / GitHub Link</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="https://portfolios.design/@username"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-muted-foreground" />
                      <span>Why Portfolios? (Short note)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      placeholder="Tell us what excites you about this role..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] resize-none transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-full btn-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      <span>{submitting ? "Sending Application..." : "Submit Application"}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
