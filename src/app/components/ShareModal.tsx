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
  Sparkles,
  QrCode,
  Smartphone,
  Send,
  Code2,
  Download,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";

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
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<"channels" | "qrcode" | "embed">("channels");

  if (!isOpen) return null;

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "https://portfolios.space");
  const cleanTitle = type === "profile" && !title.startsWith("@") ? `@${title}` : title;
  const shareText =
    type === "profile"
      ? `Explore ${cleanTitle}'s creative portfolio & showcase on Portfolios`
      : `Explore "${title}" by ${subtitle || "Creator"} on Portfolios`;

  const handleCopy = (e?: React.MouseEvent) => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);

    if (e && typeof window !== "undefined") {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 24,
        spread: 45,
        origin: { x: Math.max(0.1, Math.min(0.9, x)), y: Math.max(0.1, Math.min(0.9, y)) },
        colors: ["#CDF22B", "#bfe61e", "#0F172A", "#ffffff"],
        scalar: 0.7,
      });
    }

    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${shareUrl}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User dismissed or unsupported
      }
    } else {
      handleCopy();
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    shareUrl
  )}&color=090D16&bgcolor=FFFFFF&margin=1`;

  const shareChannels = [
    {
      name: "WhatsApp",
      desc: "Direct message",
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      brandColor: "#25D366",
      bgGradient: "hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    },
    {
      name: "X / Twitter",
      desc: "Post to feed",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      brandColor: "#1DA1F2",
      bgGradient: "hover:bg-sky-500/10 hover:border-sky-500/30 text-sky-600 dark:text-sky-400",
      iconBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25",
    },
    {
      name: "LinkedIn",
      desc: "Share network",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      brandColor: "#0A66C2",
      bgGradient: "hover:bg-blue-500/10 hover:border-blue-500/30 text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
    },
    {
      name: "Telegram",
      desc: "Send to chat",
      icon: Send,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      brandColor: "#229ED9",
      bgGradient: "hover:bg-cyan-500/10 hover:border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
      iconBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop with dark blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal / Bottom Sheet Window */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: "spring", damping: 28, stiffness: 340 }}
          className="relative w-full sm:max-w-lg bg-white dark:bg-[#121510] border-t sm:border border-slate-300/80 dark:border-white/15 rounded-t-[36px] sm:rounded-[36px] overflow-hidden z-10 flex flex-col p-5 sm:p-7 space-y-5 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] sm:pb-7 sm:my-auto shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle Ambient Brand Glow */}
          <div className="absolute top-0 right-1/4 -translate-y-1/2 w-64 h-64 bg-[#CDF22B]/10 dark:bg-[#CDF22B]/8 rounded-full blur-3xl pointer-events-none" />

          {/* Mobile Drag Handle */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto -mt-2 mb-1 sm:hidden shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md shadow-[#CDF22B]/25">
                <Share2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight leading-tight flex items-center gap-2">
                  <span>{type === "profile" ? "Share Creator Profile" : "Share Case Study"}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspire collaborators & share your creative benchmark
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
              aria-label="Close share modal"
            >
              <X size={19} />
            </button>
          </div>

          {/* Interactive Showcase Preview Card */}
          <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-slate-100/90 via-slate-50 to-white dark:from-[#181c15] dark:via-[#131611] dark:to-[#181c15] border border-slate-200 dark:border-white/10 shadow-xs group">
            {/* Top Brand Watermark Pill */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#CDF22B] animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                  PORTFOLIOS • CREATIVE SHOWCASE
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {type === "profile" ? "CREATOR PASS" : "CASE STUDY"}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              {avatarUrl && (
                <div className="relative shrink-0">
                  <img
                    src={avatarUrl}
                    alt={title}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-white/15 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#CDF22B] text-slate-950 flex items-center justify-center border-2 border-white dark:border-[#131611] shadow-xs">
                    <Sparkles size={10} />
                  </div>
                </div>
              )}

              {coverImage && !avatarUrl && (
                <div className="relative shrink-0">
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-16 h-14 rounded-2xl object-cover border-2 border-white dark:border-white/15 shadow-sm"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate font-display">
                    {cleanTitle}
                  </h4>
                  {type === "profile" && (
                    <ShieldCheck size={14} className="text-[#CDF22B] shrink-0 fill-slate-950" />
                  )}
                </div>
                {subtitle && (
                  <p className="text-xs text-muted-foreground truncate leading-relaxed">
                    {subtitle}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground/80 font-mono truncate pt-0.5">
                  {shareUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Selector Navigation */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("channels")}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "channels"
                  ? "bg-white dark:bg-[#1f241a] text-slate-950 dark:text-[#CDF22B] shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Share2 size={13} />
              <span>Share Channels</span>
            </button>

            <button
              onClick={() => setActiveTab("qrcode")}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "qrcode"
                  ? "bg-white dark:bg-[#1f241a] text-slate-950 dark:text-[#CDF22B] shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <QrCode size={13} />
              <span>Scan QR Code</span>
            </button>

            <button
              onClick={() => setActiveTab("embed")}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "embed"
                  ? "bg-white dark:bg-[#1f241a] text-slate-950 dark:text-[#CDF22B] shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 size={13} />
              <span>Embed</span>
            </button>
          </div>

          {/* TAB 1: Share Channels */}
          {activeTab === "channels" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Native System Share Sheet CTA (if supported) */}
              {hasNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#CDF22B]/20 via-[#CDF22B]/10 to-transparent border border-[#CDF22B]/40 hover:border-[#CDF22B] transition-all cursor-pointer active:scale-[0.99] group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                      <Smartphone size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">Share via System Apps</p>
                      <p className="text-[10px] text-muted-foreground">AirDrop, Messages, Stories, More</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-foreground/70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* 4 Social Channels Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {shareChannels.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 transition-all cursor-pointer group ${item.bgGradient} hover:scale-[1.02] active:scale-95`}
                    >
                      <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs ${item.iconBg}`}>
                        <Icon size={18} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-foreground leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 2: QR Code */}
          {activeTab === "qrcode" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-[#161a13] border border-slate-200 dark:border-white/10 space-y-3.5 text-center"
            >
              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-transparent">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">Scan with phone camera</p>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  Instantly open this portfolio or case study on any mobile device
                </p>
              </div>
              <a
                href={qrCodeUrl}
                download="portfolios-qr-code.png"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-secondary text-xs font-bold cursor-pointer"
              >
                <Download size={13} />
                <span>Open / Save QR Code</span>
              </a>
            </motion.div>
          )}

          {/* TAB 3: Embed */}
          {activeTab === "embed" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#161a13] border border-slate-200 dark:border-white/10"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">Interactive Showcase Embed</p>
                <p className="text-[11px] text-muted-foreground">
                  Paste this snippet onto your website, blog, or Notion page
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto select-all leading-relaxed">
                <code>{`<iframe src="${shareUrl}" width="100%" height="500" frameborder="0"></iframe>`}</code>
              </div>
              <button
                onClick={handleCopyEmbed}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  copiedEmbed
                    ? "bg-emerald-500 text-white font-bold"
                    : "btn-primary text-slate-950"
                }`}
              >
                {copiedEmbed ? (
                  <>
                    <Check size={14} />
                    <span>Embed Code Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Embed Code</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Direct Link Section with Glow Focus */}
          <div className="space-y-2 pt-2 border-t border-slate-200/90 dark:border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Direct Link</span>
              <span className="text-[10px] text-muted-foreground lowercase">1-click copy</span>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#11130e] focus-within:border-[#CDF22B] transition-colors shadow-2xs">
              <div className="pl-3 text-muted-foreground shrink-0">
                <Link2 size={16} />
              </div>
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent px-1 text-xs text-foreground font-mono focus:outline-none truncate selection:bg-[#CDF22B] selection:text-slate-950"
              />
              <button
                type="button"
                onClick={(e) => handleCopy(e)}
                className={`shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "btn-primary text-slate-950 hover:brightness-105"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Link</span>
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
