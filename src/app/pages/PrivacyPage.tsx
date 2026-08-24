import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Shield, ArrowLeft, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
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
          <Shield size={14} />
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Last updated: August 2026 • Effective immediately across all Portfolios services.
        </p>
      </div>

      {/* Content Glass Cards */}
      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <Lock size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>1. Our Core Privacy Commitment</h2>
          </div>
          <p>
            At <strong>Portfolios</strong>, we believe creative craft thrives in a calm, respectful environment. We strictly adhere to minimal data collection principles: we only collect the information necessary to showcase your work, deliver authentic peer feedback, and connect you with high-caliber clients.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <Eye size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>2. Information We Collect</h2>
          </div>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong>Account & Profile Data:</strong> Full name, username, email address, portfolio links, bio, and avatar.
            </li>
            <li>
              <strong>Project Case Studies:</strong> High-resolution imagery, project descriptions, tools used, and tags that you explicitly publish.
            </li>
            <li>
              <strong>Community Interaction:</strong> Comments, appreciations, saves, and inquiries sent through verified client contact channels.
            </li>
          </ul>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <CheckCircle2 size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>3. How We Use & Protect Your Data</h2>
          </div>
          <p>
            We never sell your personal data or creative case studies to third-party ad brokers or unauthorized AI dataset scrapers. Your projects remain 100% your intellectual property. Data transmission is encrypted via TLS 1.3 with industry-standard AES-256 storage protection.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base">
            <FileText size={18} className="text-slate-900 dark:text-[#CDF22B]" />
            <h2>4. Your Rights (GDPR & Global Standards)</h2>
          </div>
          <p>
            You retain the right to export your entire portfolio data, update privacy visibility settings, or permanently delete your account at any time via your Creator Dashboard Settings.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
