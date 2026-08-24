import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, RefreshCw, Send, CheckCircle2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function EmailVerificationBanner() {
  const { user, isLoggedIn, isEmailVerified, refreshSession, resendVerificationEmail } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // If not logged in, or already verified, or user dismissed for this tab session
  if (!isLoggedIn || !user || isEmailVerified || dismissed) {
    return null;
  }

  const handleRefreshStatus = async () => {
    setChecking(true);
    setFeedback(null);
    try {
      const result = await refreshSession();
      if (result.verified) {
        setFeedback({
          type: "success",
          text: "Email verified successfully! Full publishing features are now unlocked.",
        });
      } else {
        setFeedback({
          type: "info",
          text: "Verification not detected yet. Please click the confirmation link sent to your inbox, then click here again.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Could not refresh status. Please check your internet connection.",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setFeedback(null);
    try {
      const res = await resendVerificationEmail();
      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      } else {
        setFeedback({
          type: "success",
          text: `A new verification email has been dispatched to ${user.email}.`,
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to resend email." });
    } finally {
      setResending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Email verification notice"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full bg-[#1e231b] border-b border-[#CDF22B]/30 text-foreground relative z-30 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          {/* Text and Status Icon */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#CDF22B]/20 text-[#CDF22B] flex items-center justify-center shrink-0">
              <AlertCircle size={14} className="stroke-[2.5]" />
            </div>
            <p className="text-slate-200 font-medium leading-tight truncate">
              <span>Account unverified. Confirm your email (</span>
              <strong className="text-white font-mono">{user.email}</strong>
              <span>) to unlock project publishing & full features.</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={handleRefreshStatus}
              disabled={checking}
              className="px-3.5 py-1.5 rounded-full bg-[#CDF22B] text-slate-950 font-bold hover:bg-[#bfe61e] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={12} className={checking ? "animate-spin" : ""} />
              <span>{checking ? "Checking..." : "I've verified my email – Refresh Status"}</span>
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send size={11} className={resending ? "animate-spin" : ""} />
              <span>{resending ? "Sending..." : "Resend Link"}</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
              title="Dismiss for now"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Feedback message banner if any */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] font-medium flex items-center gap-2 border-t ${
              feedback.type === "success"
                ? "bg-[#CDF22B]/20 text-[#CDF22B] border-[#CDF22B]/30"
                : feedback.type === "error"
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : "bg-slate-800 text-slate-300 border-white/10"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={13} className="shrink-0 text-[#CDF22B]" />
            ) : (
              <AlertCircle size={13} className="shrink-0" />
            )}
            <span>{feedback.text}</span>
          </motion.div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}
