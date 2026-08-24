import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, ArrowRight, Compass, Users, CheckCircle2, X } from "lucide-react";
import confetti from "canvas-confetti";
import { CATEGORIES } from "../data/categories";
import { useCreator } from "../hooks/useCreator";
import { useLanguage } from "../context/LanguageContext";

const LOCAL_STORAGE_ONBOARDING_KEY = "azaiza_onboarding_completed_v3";

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(["ui-ux", "3d-motion"]);
  const { allCreators, toggleFollow } = useCreator();
  const { t } = useLanguage();

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
      particleCount: 70,
      spread: 55,
      origin: { y: 0.6 },
      colors: ["#CDF22B", "#0F172A", "#FFFFFF"],
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative rounded-3xl border border-primary/40 bg-card p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 space-y-6 overflow-hidden"
        >
          {/* Neon Glow Header Pill */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-[11px] font-mono font-bold">
              <Sparkles size={12} />
              <span>Welcome to Azaiza Gallery</span>
            </div>

            <button
              onClick={handleFinish}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>

          {step === 1 ? (
            /* Step 1: Creative Fields */
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
                  What creative crafts inspire you?
                </h3>
                <p className="text-xs text-muted-foreground">
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
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/30"
                          : "border-border bg-muted/20 hover:bg-muted/40 text-foreground"
                      }`}
                    >
                      <span className="text-xs truncate">{cat.name}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "bg-primary text-black border-primary" : "border-border"
                        }`}
                      >
                        {isSelected && <Check size={10} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Follow Curators</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Follow Top Creators */
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
                  Follow Visionary Creators
                </h3>
                <p className="text-xs text-muted-foreground">
                  Stay updated with case studies and spatial interfaces from top verified designers.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {allCreators.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-border bg-muted/20 hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={c.avatarUrl}
                        alt={c.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-foreground truncate">
                          {c.fullName}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono truncate">
                          @{c.username}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFollow(c.id)}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                        c.isFollowing
                          ? "bg-muted text-muted-foreground border border-border"
                          : "bg-primary text-primary-foreground shadow-xs hover:opacity-90"
                      }`}
                    >
                      {c.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-7 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-[0_0_20px_rgba(0,87,255,0.35)] hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Start Exploring Gallery</span>
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
