import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, Mail, Send, Sparkles, X, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function EmailVerificationBanner() {
  const { user, isLoggedIn, isEmailVerified, resendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // If not logged in, or already verified, or user dismissed for this session, don't show
  if (!isLoggedIn || isEmailVerified || user?.isEmailVerified === true || dismissed || !user?.email) {
    return null;
  }

  const handleResend = async () => {
    setSending(true);
    setFeedback(null);
    try {
      const res = await resendVerificationEmail();
      if (res.error) {
        setFeedback(res.error);
      } else {
        setFeedback("Verification link sent! Please check your inbox & spam folder.");
      }
    } catch (err: any) {
      setFeedback("Failed to send verification link. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-[#CDF22B] text-slate-950 px-4 py-2 text-xs font-medium z-60 relative transition-all border-b border-black/10 shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Mail size={15} className="shrink-0 font-bold" />
            <span>
              <strong>Verify your email ({user.email}):</strong> Please check your inbox and verify your account so you can publish projects on the platform.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {feedback ? (
              <span className="text-[11px] font-bold bg-black/10 px-2.5 py-1 rounded-md">
                {feedback}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={sending}
                className="px-3 py-1 rounded-full bg-slate-950 text-[#CDF22B] font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Send size={11} />
                )}
                <span>Resend Verification Email</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="p-1 rounded-md hover:bg-black/10 transition-colors cursor-pointer text-slate-900"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
