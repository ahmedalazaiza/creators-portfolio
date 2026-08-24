import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  Send,
  Calendar,
  DollarSign,
  Loader2,
  User,
  Mail,
  Building,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Profile } from "../types";
import { useInquiries } from "../hooks/useInquiries";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Profile;
}

const BUDGET_OPTIONS = [
  "Under $2,000",
  "$2,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
];

const TIMELINE_OPTIONS = [
  "Immediately (< 1 week)",
  "2 - 4 Weeks",
  "1 - 3 Months",
  "Flexible",
];

export default function HireModal({ isOpen, onClose, creator }: HireModalProps) {
  const { sendInquiry } = useInquiries();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [budgetRange, setBudgetRange] = useState(BUDGET_OPTIONS[1]);
  const [projectTimeline, setProjectTimeline] = useState(TIMELINE_OPTIONS[1]);
  const [projectBrief, setProjectBrief] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !projectBrief.trim()) return;

    setSubmitting(true);
    try {
      await sendInquiry(creator.id, {
        clientName,
        clientEmail,
        companyName,
        budgetRange,
        projectTimeline,
        projectBrief,
      });

      setSubmitted(true);
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#CDF22B", "#0F172A", "#FFFFFF"],
      });
    } catch (err) {
      console.warn("Failed to submit inquiry:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setClientName("");
    setClientEmail("");
    setCompanyName("");
    setProjectBrief("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        />

        {/* Modal / Bottom Sheet Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative w-full sm:max-w-lg bg-white dark:bg-[#151813] border-t sm:border border-slate-300 dark:border-white/15 rounded-t-[32px] sm:rounded-[32px] overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[90vh] shadow-2xl pb-[max(1rem,env(safe-area-inset-bottom,1rem))] sm:pb-0 sm:my-auto"
        >
          {/* Mobile Drag Indicator Bar */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-3 mb-1 sm:hidden shrink-0" />

          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#11130e] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={creator.avatarUrl}
                alt={creator.fullName}
                className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-white/20 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-foreground truncate flex items-center gap-1.5">
                  <span>Hire & Commission</span>
                  <span className="text-slate-900 dark:text-[#CDF22B] font-mono">@{creator.username}</span>
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available for freelance commissions
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {submitted ? (
            /* Success State */
            <div className="p-8 sm:p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center mx-auto border border-[#CDF22B]/30">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold text-foreground">
                  Inquiry Sent Successfully!
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your project brief has been sent to <strong className="text-foreground">{creator.fullName}</strong>. They will review and reply to <span className="text-foreground underline">{clientEmail}</span> shortly.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold cursor-pointer"
                >
                  Done & Back to Creator
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <User size={13} className="text-muted-foreground" />
                    <span>Your Name</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <Mail size={13} className="text-muted-foreground" />
                    <span>Your Email</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Building size={13} className="text-muted-foreground" />
                  <span>Company / Organization (Optional)</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Studio Labs Inc."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] transition-colors"
                />
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <DollarSign size={13} className="text-slate-900 dark:text-[#CDF22B]" />
                    <span>Estimated Budget</span>
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground focus:outline-none focus:border-[#CDF22B] cursor-pointer"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-white dark:bg-[#151813] text-foreground">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-900 dark:text-[#CDF22B]" />
                    <span>Desired Timeline</span>
                  </label>
                  <select
                    value={projectTimeline}
                    onChange={(e) => setProjectTimeline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground focus:outline-none focus:border-[#CDF22B] cursor-pointer"
                  >
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-white dark:bg-[#151813] text-foreground">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Brief */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-muted-foreground" />
                  <span>Project Brief & Scope</span>
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={projectBrief}
                  onChange={(e) => setProjectBrief(e.target.value)}
                  placeholder="Describe your design goals, deliverables needed, reference links, and expectations..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#CDF22B] resize-none transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="min-h-[44px] px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-foreground transition-colors cursor-pointer active:scale-95"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-[44px] px-6 py-2 rounded-full btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Project Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

