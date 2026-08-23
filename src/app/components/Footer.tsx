import React, { useState } from "react";
import { Link } from "react-router";
import { Sparkles, Heart, ArrowUpRight, Check, Send, Twitter, Dribbble, Instagram, Github } from "lucide-react";
import { CATEGORIES } from "../data/categories";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-md pt-12 pb-8 mt-12 text-muted-foreground text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <Link
              to="/"
              className="inline-block text-3xl sm:text-4xl text-foreground hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Cookie', cursive" }}
            >
              Azaiza<span className="text-primary font-sans">.</span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              The premier creative showcase platform for visionary UI/UX architects, 3D CGI motion artists, and fine-art photographers worldwide.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary font-semibold">
                <Sparkles size={11} /> Handcrafted with Precision
              </span>
            </div>
          </div>

          {/* Creative Fields */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-foreground font-bold mb-3">
              Explore Fields
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.filter((c) => c.slug !== "all").slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/?category=${cat.slug}`}
                    className="hover:text-primary transition-colors block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators Studio */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-foreground font-bold mb-3">
              Creator Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/creators" className="hover:text-primary transition-colors">
                  Discover Creators
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard/new" className="hover:text-primary transition-colors">
                  Upload Case Study
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Studio Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/settings" className="hover:text-primary transition-colors">
                  Portfolio Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-foreground font-bold mb-1">
              Stay Inspired
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Curated weekly digest of benchmark UI/UX and 3D visual masterworks.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.design"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60 pr-10"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {subscribed ? <Check size={12} /> : <Send size={12} />}
                </button>
              </div>
              {subscribed && (
                <span className="text-[10px] font-mono text-emerald-400 block">
                  ✓ You're subscribed to weekly inspiration!
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            © {currentYear} Azaiza Gallery. All masterworks belong to their respective creators.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full border border-border bg-card hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={13} />
            </a>
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full border border-border bg-card hover:text-primary transition-colors"
              aria-label="Dribbble"
            >
              <Dribbble size={13} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full border border-border bg-card hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={13} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full border border-border bg-card hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
