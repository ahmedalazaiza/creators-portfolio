import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Check, X, Sparkles, Send, Briefcase, Calendar, DollarSign, Loader2 } from "lucide-react";
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
        particleCount: 80,
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative rounded-3xl border border-border bg-card p-6 sm:p-7 max-w-lg w-full shadow-2xl z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <img
                src={creator.avatarUrl}
                alt={creator.fullName}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <span>Hire & Commission</span>
                  <span className="text-primary">@{creator.username}</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available for freelance projects
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X size={16} />
            </button>
          </div>

          {submitted ? (
            /* Success State */
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto shadow-md">
                <Check size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">
                  Inquiry Sent Successfully!
                </h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Your project brief has been sent to <strong>{creator.fullName}</strong>. They will review and reply to <strong>{clientEmail}</strong> shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">
                    Your Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">
                    Your Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Studio Labs Inc."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                />
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground flex items-center gap-1">
                    <DollarSign size={12} className="text-primary" /> Estimated Budget
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60 cursor-pointer"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground flex items-center gap-1">
                    <Calendar size={12} className="text-primary" /> Desired Timeline
                  </label>
                  <select
                    value={projectTimeline}
                    onChange={(e) => setProjectTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60 cursor-pointer"
                  >
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Brief */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">
                  Project Brief & Scope <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={projectBrief}
                  onChange={(e) => setProjectBrief(e.target.value)}
                  placeholder="Describe your design goals, deliverables needed, reference links, and expectations..."
                  className="w-full p-3 rounded-xl border border-border bg-input-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2 rounded-full btn-secondary text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-[0_0_15px_rgba(205,242,43,0.3)] hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
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
