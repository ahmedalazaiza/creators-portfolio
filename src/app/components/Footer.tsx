import React from "react";
import { Link } from "react-router";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#CDF22B] text-slate-900 flex items-center justify-center font-bold text-xs">
            <Sparkles size={12} />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">
            Portfolios<span className="text-[#CDF22B]">.</span>
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <Link to="/creators" className="hover:text-foreground transition-colors">
            Creators
          </Link>
          <Link to="/login" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="hover:text-foreground transition-colors">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
