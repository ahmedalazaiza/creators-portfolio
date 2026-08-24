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
} from "lucide-react";
import { CATEGORIES } from "../data/categories";

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
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70 transition-colors pt-16 pb-10 text-xs text-muted-foreground relative overflow-hidden backdrop-blur-2xl">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-foreground shadow-2xs">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-[#CDF22B] transition-colors pr-10"
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

            {/* Social Media Links */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              {[
                { name: "X / Twitter", url: "https://twitter.com" },
                { name: "Behance", url: "https://behance.net" },
                { name: "Dribbble", url: "https://dribbble.com" },
                { name: "Instagram", url: "https://instagram.com" },
                { name: "GitHub", url: "https://github.com" },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 hover:bg-[#CDF22B] hover:text-slate-900 text-[10px] font-semibold text-muted-foreground transition-colors cursor-pointer"
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Connected Legal Links */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
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
