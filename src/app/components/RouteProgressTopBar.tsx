import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";

export default function RouteProgressTopBar() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger on route change
    setIsNavigating(true);
    setProgress(20);

    const timer1 = setTimeout(() => {
      setProgress(65);
    }, 80);

    const timer2 = setTimeout(() => {
      setProgress(90);
    }, 180);

    const timer3 = setTimeout(() => {
      setProgress(100);
    }, 280);

    const timer4 = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 550);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[3px]">
          <motion.div
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{
              width: { duration: 0.22, ease: "easeOut" },
              opacity: { duration: 0.25, delay: 0.1 },
            }}
            className="h-full bg-[#CDF22B] shadow-[0_0_12px_#CDF22B,0_0_24px_rgba(205,242,43,0.8)] relative"
          >
            {/* Glowing lead tip */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[3px] opacity-80" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
