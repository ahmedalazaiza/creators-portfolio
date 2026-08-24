import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
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
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedJob(null);
        setApplicantName("");
        setApplicantEmail("");
        setPortfolioLink("");
        setApplicantNote("");
      }, 2000);
    }, 900);
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
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-foreground font-semibold text-xs hover:bg-slate-200 transition-all"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-xl rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-5 my-auto"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold font-mono text-[#CDF22B] uppercase">
                    Application
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-display text-foreground">
                    {selectedJob.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-base font-bold text-foreground">
                    Application Submitted!
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Thank you! Our recruitment lead will review your submission and get in touch within 5 days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Leo DaVinci"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-foreground focus:outline-none focus:border-[#CDF22B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Email Address</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="leo@design.studio"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-foreground focus:outline-none focus:border-[#CDF22B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Portfolio / GitHub Link</label>
                    <input
                      type="url"
                      required
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="https://portfolios.design/@username"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-foreground focus:outline-none focus:border-[#CDF22B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Why Portfolios? (Short note)</label>
                    <textarea
                      rows={3}
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      placeholder="Tell us what excites you about this role..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-foreground focus:outline-none focus:border-[#CDF22B] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-full btn-primary font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    <span>{submitting ? "Sending Application..." : "Submit Application"}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
