import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Sparkles, ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-10 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-3xl bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] flex items-center justify-center mx-auto text-2xl font-bold font-mono">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            Page Not Found
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The page or portfolio link you are looking for has been moved or does not exist.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold shadow-md active:scale-95 flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Return Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
