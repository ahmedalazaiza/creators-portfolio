import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

interface AppLoadingScreenProps {
  isLoading: boolean;
  message?: string;
}

export default function AppLoadingScreen({
  isLoading,
  message = "Curating creative showcase & design benchmarks...",
}: AppLoadingScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Smooth minimum threshold to prevent abrupt flicker
      const timeout = setTimeout(() => {
        setShow(false);
      }, 350);
      return () => clearTimeout(timeout);
    } else {
      setShow(true);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="app-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999999] bg-[#070905] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient Brand Glowing Orbs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#CDF22B]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#CDF22B]/8 rounded-full blur-2xl pointer-events-none" />

          {/* Central Branded Card */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm"
          >
            {/* Logo Icon with Pulse Glow */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-black shadow-[0_0_35px_rgba(205,242,43,0.45)] border-2 border-[#CDF22B]/80"
              >
                <Sparkles size={32} className="fill-slate-950" />
              </motion.div>

              {/* Orbiting Ring Indicator */}
              <div className="absolute -inset-2.5 rounded-[32px] border border-[#CDF22B]/30 animate-spin [animation-duration:10s] pointer-events-none" />
            </div>

            {/* Typography */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white flex items-center justify-center gap-1.5">
                <span>Portfolios</span>
                <span className="text-[#CDF22B]">.</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-tight max-w-[260px] mx-auto leading-relaxed">
                {message}
              </p>
            </div>

            {/* Glowing Linear Progress Bar */}
            <div className="w-56 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut",
                }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#CDF22B] to-transparent rounded-full shadow-[0_0_12px_#CDF22B]"
              />
            </div>
          </motion.div>

          {/* Bottom Version Watermark */}
          <div className="absolute bottom-7 text-[10px] font-mono text-slate-500 tracking-widest uppercase">
            PORTFOLIOS SPACE • CRAFT & BENCHMARKS
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
