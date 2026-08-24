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
  Facebook,
  Mail,
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
      ? `Check out @${title}'s portfolio on Portfolios`
      : `Check out "${title}" on Portfolios`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText}\n${shareUrl}`
      )}`,
      color: "hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      name: "Twitter / X",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-sky-500 hover:border-sky-500/30 hover:bg-sky-500/10",
      iconColor: "text-sky-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      color: "hover:text-blue-600 hover:border-blue-600/30 hover:bg-blue-600/10",
      iconColor: "text-blue-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      color: "hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/10",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white dark:bg-[#151813] border border-slate-300 dark:border-white/15 rounded-[32px] overflow-hidden z-10 flex flex-col p-6 sm:p-7 space-y-6 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shrink-0">
                <Share2 size={18} />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground leading-snug">
                  {type === "profile" ? "Share Creator Profile" : "Share Case Study"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Spread creative inspiration
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close share modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Preview Card */}
          {(avatarUrl || coverImage || subtitle) && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#11130e] border border-slate-200 dark:border-white/10">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={title}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-white/20 shrink-0"
                />
              )}
              {coverImage && (
                <img
                  src={coverImage}
                  alt={title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/20 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-foreground truncate">
                  {title}
                </div>
                {subtitle && (
                  <div className="text-[11px] text-muted-foreground truncate">
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 1-Click Social Sharing Links */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
              Share to Social Channels
            </label>
            <div className="grid grid-cols-4 gap-2">
              {shareLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 transition-all text-xs font-medium text-foreground cursor-pointer ${item.color}`}
                  >
                    <Icon size={18} className={item.iconColor} />
                    <span className="text-[11px] font-semibold truncate">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
              Copy Direct Link
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#11130e]">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent px-3 text-xs text-foreground font-mono focus:outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "btn-primary text-slate-950"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={13} />
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

