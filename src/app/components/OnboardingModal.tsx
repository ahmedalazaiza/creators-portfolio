import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, ArrowRight, X } from "lucide-react";
import confetti from "canvas-confetti";
import { CATEGORIES } from "../data/categories";
import { useCreator } from "../hooks/useCreator";

const LOCAL_STORAGE_ONBOARDING_KEY = "portfolios_onboarding_completed_v4";

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(["ui-ux", "3d-motion"]);
  const { allCreators } = useCreator();
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});

  const toggleFollow = (creatorId: string) => {
    setFollowedIds((prev) => ({
      ...prev,
      [creatorId]: !prev[creatorId],
    }));
  };

  useEffect(() => {
    const completed = localStorage.getItem(LOCAL_STORAGE_ONBOARDING_KEY);
    if (!completed) {
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  const toggleDiscipline = (slug: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleFinish = () => {
    localStorage.setItem(LOCAL_STORAGE_ONBOARDING_KEY, "true");
    setIsOpen(false);
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#CDF22B", "#0F172A", "#FFFFFF"],
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleFinish}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        />

        {/* Modal / Bottom Sheet Window */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative w-full sm:max-w-lg bg-white dark:bg-[#151813] border-t sm:border border-slate-300 dark:border-white/15 rounded-t-[32px] sm:rounded-[32px] overflow-hidden z-10 flex flex-col p-6 sm:p-8 space-y-6 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] sm:pb-8 sm:my-auto shadow-2xl"
        >
          {/* Mobile Drag Indicator Bar */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto -mt-3 mb-1 sm:hidden shrink-0" />

          {/* Header Pill */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-[#CDF22B] dark:bg-[#CDF22B] dark:text-slate-950 text-[11px] font-mono font-bold">
              <Sparkles size={12} />
              <span>Welcome to Portfolios</span>
            </div>

            <button
              onClick={handleFinish}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close welcome modal"
            >
              <X size={18} />
            </button>
          </div>

          {step === 1 ? (
            /* Step 1: Creative Fields */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-foreground leading-tight">
                  What creative crafts inspire you?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Personalize your curated Explore feed by selecting your favorite disciplines.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
                  const isSelected = selectedDisciplines.includes(cat.slug);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleDiscipline(cat.slug)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-[#CDF22B] text-slate-950 border-[#CDF22B] font-bold"
                          : "border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-foreground/90 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <span className="text-xs font-semibold truncate">{cat.name}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-slate-950 text-[#CDF22B] border-slate-950" : "border-slate-300 dark:border-white/20"
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-full btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <span>Next: Follow Creators</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Follow Top Creators */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-foreground leading-tight">
                  Follow Visionary Creators
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Stay updated with case studies and spatial interfaces from top verified designers.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                {allCreators.slice(0, 4).map((c) => {
                  const isFollowing = Boolean(followedIds[c.id]);
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={c.avatarUrl}
                          alt={c.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/15 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">
                            {c.fullName}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono truncate">
                            @{c.username}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFollow(c.id)}
                        className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                          isFollowing
                            ? "border border-slate-200 dark:border-white/15 text-muted-foreground hover:text-foreground"
                            : "btn-primary text-slate-950 font-bold"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-7 py-2.5 rounded-full btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <span>Start Exploring</span>
                  <Check size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

