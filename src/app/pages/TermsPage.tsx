import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { FileText, ArrowLeft, Scale, Copyright, Users, Award } from "lucide-react";

export default function TermsPage() {
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
          <Scale size={14} />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Last updated: August 2026 • Portfolios Platform User Agreement.
        </p>
      </div>

      {/* Content Glass Cards */}
      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <Copyright size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>1. Creator Intellectual Property</h2>
          </div>
          <p>
            You retain <strong>complete, unencumbered ownership and copyright</strong> over all artwork, 3D renderings, UI kits, design systems, and written case studies uploaded to Portfolios. By publishing, you grant Portfolios a non-exclusive license solely to display, index, and promote your work within our curated directory.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <Users size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>2. Community Conduct & Authenticity</h2>
          </div>
          <p>
            Portfolios is a high-trust creative network. Members must only upload original work or projects where they hold explicit creative rights and proper co-creator attribution. Plagiarism, deceptive scrapers, and malicious behavior result in immediate account suspension.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <Award size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>3. Client Inquiries & Commercial Dealings</h2>
          </div>
          <p>
            Portfolios facilitates direct client inquiries between commissioners and creators with 0% platform commission on freelance engagements. Contracts, invoicing, and deliverables are handled directly between the creator and the client.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
