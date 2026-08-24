import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Send, X, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
}: EmailVerificationModalProps) {
  const { user, resendVerificationEmail, refreshSession } = useAuth();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleRefreshStatus = async () => {
    setChecking(true);
    setFeedback(null);
    try {
      const res = await refreshSession();
      if (res.verified) {
        setFeedback({
          type: "success",
          text: "Verification confirmed! You can now publish projects.",
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setFeedback({
          type: "info",
          text: "Verification not detected yet. Please click the confirmation link in your email, then try again.",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to verify status. Please check your connection." });
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setSending(true);
    setFeedback(null);
    try {
      const res = await resendVerificationEmail();
      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      } else {
        setFeedback({
          type: "success",
          text: "Verification link sent! Please check your inbox and spam folder.",
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: "Failed to send verification email." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/80 dark:border-white/10 shadow-2xl space-y-5 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#1e231b] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center mx-auto shadow-inner">
            <Mail size={26} />
          </div>

          <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
            Email Verification Required
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To maintain platform quality and prevent spam, your account (<strong>{user?.email}</strong>) must be verified before publishing projects.
          </p>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 font-medium ${
                feedback.type === "success"
                  ? "bg-[#CDF22B]/20 text-slate-950 dark:text-[#CDF22B] border border-[#CDF22B]/50"
                  : feedback.type === "error"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  : "bg-slate-100 dark:bg-[#1e231b] text-foreground border border-slate-200 dark:border-white/10"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-[#CDF22B]" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <span>{feedback.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={handleRefreshStatus}
            disabled={checking}
            className="w-full py-3 rounded-full btn-primary font-bold text-xs shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {checking ? (
              <Loader2 size={16} className="animate-spin text-slate-900" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>{checking ? "Checking Verification..." : "I've verified my email – Refresh Status"}</span>
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="w-full py-2.5 rounded-full bg-slate-100 dark:bg-[#1e231b] hover:bg-slate-200 dark:hover:bg-[#2E3823] text-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {sending ? (
              <Loader2 size={14} className="animate-spin text-foreground" />
            ) : (
              <Send size={13} />
            )}
            <span>Resend Verification Link</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel / Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
