import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X, Check, ShieldAlert, Loader2 } from "lucide-react";
import { useModeration } from "../hooks/useModeration";
import { useLanguage } from "../context/LanguageContext";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "project" | "comment" | "creator";
  targetId: string;
  targetTitle?: string;
}

const REPORT_REASONS = [
  "Copyright or IP Infringement",
  "Spam or Misleading Content",
  "Inappropriate or Graphic Material",
  "Harassment or Impersonation",
  "AI Generated with False Human Attribution",
  "Other Policy Violation",
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
}: ReportModalProps) {
  const { submitReport } = useModeration();
  const { t } = useLanguage();

  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitReport(targetType, targetId, reason, details, targetTitle);
      setSubmitted(true);
    } catch (err) {
      console.warn("Failed to submit report:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setDetails("");
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

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative rounded-3xl border border-border bg-card p-6 max-w-md w-full shadow-2xl z-10 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-destructive" />
              <h3 className="text-sm font-bold text-foreground">
                {t("report.title", "Report Content")}
              </h3>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X size={15} />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <h4 className="text-sm font-bold text-foreground">
                Report Submitted
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Thank you for keeping the Azaiza Gallery creative community safe. Our curators will review this item.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs text-muted-foreground">
                Reporting: <strong className="text-foreground">{targetTitle || targetId}</strong>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {t("report.reason", "Reason for Report")}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60 cursor-pointer"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">
                  {t("report.details", "Additional Details & Context")}
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide any links or specific notes to aid investigation..."
                  className="w-full p-3 rounded-xl border border-border bg-input-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-1.5 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-1.5 rounded-full bg-destructive text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <ShieldAlert size={13} />
                  )}
                  <span>Submit Report</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
