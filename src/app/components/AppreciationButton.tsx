import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";

interface AppreciationButtonProps {
  isAppreciated?: boolean;
  count: number;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function AppreciationButton({
  isAppreciated = false,
  count,
  onToggle,
  size = "md",
  showLabel = true,
  className = "",
}: AppreciationButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 600);
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const buttonClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      aria-label={isAppreciated ? "Remove appreciation" : "Appreciate project"}
      className={`relative group inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 cursor-pointer select-none ${
        isAppreciated
          ? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] border border-rose-400"
          : "bg-card/90 hover:bg-card border border-border text-foreground hover:border-primary/50 hover:text-primary shadow-sm"
      } ${buttonClasses[size]} ${className}`}
    >
      {/* Burst particles */}
      {animating && isAppreciated && (
        <span className="absolute inset-0 rounded-full pointer-events-none animate-ping bg-rose-500/30" />
      )}

      <motion.span
        animate={
          animating
            ? { scale: [1, 1.45, 0.9, 1.15, 1], rotate: [0, -15, 15, -5, 0] }
            : { scale: 1 }
        }
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Heart
          size={iconSizes[size]}
          className={`transition-colors ${
            isAppreciated ? "fill-white text-white" : "text-muted-foreground group-hover:text-rose-500"
          }`}
        />
      </motion.span>

      <span className="font-mono tracking-tight font-medium">
        {count.toLocaleString()}
      </span>

      {showLabel && (
        <span className="hidden sm:inline font-sans text-xs opacity-90">
          {isAppreciated ? "Appreciated" : "Appreciate"}
        </span>
      )}
    </motion.button>
  );
}
