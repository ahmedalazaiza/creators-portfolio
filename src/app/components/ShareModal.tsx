import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Copy,
  Check,
  Share2,
  Twitter,
  Linkedin,
  MessageCircle,
  Link2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  type?: "profile" | "project";
  subtitle?: string;
  avatarUrl?: string;
  coverImage?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  type = "project",
  subtitle,
  avatarUrl,
  coverImage,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || window.location.href;
  const shareText =
    type === "profile"
      ? `Check out @${title}'s creative portfolio on Portfolios`
      : `Check out "${title}" on Portfolios`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      sub: "Send message",
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText}\n${shareUrl}`
      )}`,
      badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40 hover:bg-emerald-500/5",
    },
    {
      name: "Twitter / X",
      sub: "Post to feed",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      badgeBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      hoverBorder: "hover:border-sky-500/40 hover:bg-sky-500/5",
    },
    {
      name: "LinkedIn",
      sub: "Share network",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      hoverBorder: "hover:border-blue-500/40 hover:bg-blue-500/5",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        />

        {/* Modal / Bottom Sheet Window */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative w-full sm:max-w-md bg-white dark:bg-[#151813] border-t sm:border border-slate-300 dark:border-white/15 rounded-t-[32px] sm:rounded-[32px] overflow-hidden z-10 flex flex-col p-5 sm:p-7 space-y-5 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] sm:pb-7 sm:my-auto shadow-2xl"
        >
          {/* Mobile Drag Indicator Bar */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto -mt-2 mb-1 sm:hidden shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Share2 size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">
                  {type === "profile" ? "Share Creator Profile" : "Share Case Study"}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Spread creative benchmark & craft
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close share modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Preview Card */}
          {(avatarUrl || coverImage || subtitle) && (
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10">
              {avatarUrl && (
                <div className="relative shrink-0">
                  <img
                    src={avatarUrl}
                    alt={title}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 dark:border-white/20"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#CDF22B] text-slate-950 flex items-center justify-center border border-white dark:border-slate-950">
                    <Sparkles size={9} />
                  </div>
                </div>
              )}
              {coverImage && (
                <img
                  src={coverImage}
                  alt={title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/20 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-foreground truncate flex items-center gap-1">
                  <span>{type === "profile" && !title.startsWith("@") ? `@${title}` : title}</span>
                </div>
                {subtitle && (
                  <div className="text-[11px] text-muted-foreground truncate leading-relaxed">
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 1-Click Social Channels */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Share to Channels
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {shareLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 transition-all cursor-pointer group ${item.hoverBorder} hover:scale-[1.02] active:scale-95`}
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${item.badgeBg}`}>
                      <Icon size={18} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-foreground">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.sub}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copy Direct Link Section */}
          <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-white/10">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Direct Link
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#11130e]">
              <div className="pl-2.5 text-muted-foreground shrink-0">
                <Link2 size={15} />
              </div>
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent px-1.5 text-xs text-foreground font-mono focus:outline-none truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "btn-primary text-slate-950"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={13} strokeWidth={2.5} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


