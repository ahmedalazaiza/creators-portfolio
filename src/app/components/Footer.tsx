import React, { useState } from "react";
import { Link } from "react-router";
import {
  Sparkles,
  ArrowRight,
  Check,
  Globe,
  Heart,
  Compass,
  Layout,
  Layers,
  Box,
  Camera,
  PenTool,
  Building,
  Cpu,
  Shield,
  FileText,
  Cookie,
  Sliders,
  Twitter,
  Instagram,
  Github,
  Dribbble,
  Linkedin,
} from "lucide-react";
import { CATEGORIES } from "../data/categories";

const BehanceIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.116 0-6.625-3.007-6.625-6.857 0-4.047 2.656-7.143 6.744-7.143 4.249 0 6.256 3.109 6.256 6.719 0 .54-.055 1.281-.055 1.281h-9.922c0 2.617 1.83 4.148 4.095 4.148 1.936 0 3.324-.954 3.738-2.148h1.87zm-9.907-4.542h7.027c-.085-1.748-1.099-3.458-3.414-3.458-2.316 0-3.376 1.637-3.613 3.458zm-11.819-7.458h6.417c2.253 0 3.583 1.059 3.583 2.87 0 1.238-.636 2.195-1.761 2.666 1.547.458 2.361 1.704 2.361 3.238 0 2.296-1.764 3.226-4.07 3.226h-6.53v-12zm3.016 4.756h3.044c.95 0 1.621-.368 1.621-1.281 0-.854-.627-1.258-1.579-1.258h-3.086v2.539zm0 5.034h3.336c1.11 0 1.877-.456 1.877-1.472 0-.961-.75-1.408-1.877-1.408h-3.336v2.88z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#11140e] transition-colors pt-16 pb-10 text-xs text-muted-foreground relative overflow-hidden backdrop-blur-2xl">
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CDF22B]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand & Manifesto (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-[#CDF22B] text-slate-900 flex items-center justify-center font-bold text-sm shadow-md shadow-[#CDF22B]/20 group-hover:scale-105 transition-transform">
                <Sparkles size={16} />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Portfolios<span className="text-[#CDF22B]">.</span>
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              The calm, elevated showcase for product designers, 3D artists, and visual creators to present deep case studies with high-fidelity craft and genuine community feedback.
            </p>

            {/* Platform Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-[11px] font-mono text-foreground shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CDF22B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CDF22B]"></span>
              </span>
              <span>Curated Network Live • v2.4</span>
            </div>
          </div>

          {/* Column 2: Explore Disciplines (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Creative Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/?category=${cat.slug}`}
                    className="hover:text-foreground hover:translate-x-1 inline-block transition-all"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform & Community (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Platform & Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Explore Showcase
                </Link>
              </li>
              <li>
                <Link to="/creators" className="hover:text-foreground transition-colors">
                  Creators Directory
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">
                  Creator Studio
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-foreground transition-colors">
                  Upload Case Study
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-foreground transition-colors">
                  Showcase Guidelines
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Stay Inspired (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              Stay Inspired
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Receive hand-picked weekly case studies and design breakthroughs directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-[#CDF22B] transition-colors pr-10"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 p-1.5 rounded-lg bg-[#CDF22B] text-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
                >
                  <ArrowRight size={13} />
                </button>
              </div>

              {subscribed && (
                <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium animate-fadeIn">
                  <Check size={13} />
                  <span>You're subscribed! Welcome aboard.</span>
                </div>
              )}
            </form>

            {/* Social Media Links (Icon Buttons) */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {[
                { name: "Twitter / X", icon: <Twitter size={15} />, url: "https://twitter.com" },
                { name: "Behance", icon: <BehanceIcon size={15} />, url: "https://behance.net" },
                { name: "Dribbble", icon: <Dribbble size={15} />, url: "https://dribbble.com" },
                { name: "Instagram", icon: <Instagram size={15} />, url: "https://instagram.com" },
                { name: "GitHub", icon: <Github size={15} />, url: "https://github.com" },
                { name: "LinkedIn", icon: <Linkedin size={15} />, url: "https://linkedin.com" },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  title={platform.name}
                  aria-label={platform.name}
                  className="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-[#171915] border border-transparent dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-[#CDF22B] hover:text-slate-950 dark:hover:bg-[#CDF22B] dark:hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Connected Legal Links */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Portfolios Inc.</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              Crafted with calm energy for creators <Sparkles size={11} className="text-[#CDF22B]" />
            </span>
          </div>

          {/* Connected Footer Pages */}
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="hover:text-foreground transition-colors hover:underline"
            >
              Cookie Preferences
            </Link>
            <Link
              to="/guidelines"
              className="hover:text-foreground transition-colors hover:underline"
            >
              Guidelines
            </Link>
            <Link
              to="/assets"
              className="hover:text-foreground transition-colors hover:underline"
            >
              Brand Assets
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
