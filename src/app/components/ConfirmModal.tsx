import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => {
              if (!isLoading) onClose();
            }}
          />

          {/* Modal / Bottom Sheet Box */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full sm:max-w-md bg-white dark:bg-[#151813] border-t sm:border border-slate-300 dark:border-white/15 rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.4)] z-10 overflow-hidden pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] sm:pb-7"
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto -mt-2 mb-3 sm:hidden shrink-0" />

            {/* Top Close Button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Header with Icon */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isDestructive
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] border border-[#CDF22B]/30"
                }`}
              >
                {isDestructive ? <Trash2 size={22} /> : <AlertTriangle size={22} />}
              </div>
              <div className="pt-0.5 pr-6">
                <h3 className="text-base sm:text-lg font-display font-bold text-foreground">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Item Highlight if provided */}
            {itemName && (
              <div className="mb-6 p-3 rounded-xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10 text-xs font-mono text-foreground font-medium truncate">
                <span className="text-muted-foreground mr-1.5">Target:</span>
                {itemName}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="min-h-[44px] px-5 py-2.5 rounded-full btn-secondary font-medium text-xs sm:text-sm transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`min-h-[44px] px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer ${
                  isDestructive
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                    : "btn-primary text-slate-950"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {isDestructive && <Trash2 size={15} />}
                    <span>{confirmText}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
