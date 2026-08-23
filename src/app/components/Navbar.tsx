import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Plus,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { user, isLoggedIn, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { label: "Explore", path: "/" },
    { label: "Creators", path: "/creators" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#CDF22B] text-slate-900 flex items-center justify-center shadow-md shadow-[#CDF22B]/20 group-hover:scale-105 transition-transform font-bold">
              <Sparkles size={16} />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Portfolios<span className="text-[#CDF22B]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions & Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun size={16} className="text-[#CDF22B]" /> : <Moon size={16} />}
          </button>

          {/* Logged In vs Logged Out State */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* "+ New Project" Button */}
              <Link
                to="/create"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-primary text-xs font-bold active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>New Project</span>
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-800 hover:border-[#CDF22B] transition-colors cursor-pointer"
                >
                  <img
                    src={
                      user?.avatarUrl ||
                      `https://api.dicebear.com/7.x/shapes/svg?seed=${user?.username || "user"}`
                    }
                    alt={user?.fullName || "User avatar"}
                    className="w-7 h-7 rounded-full object-cover bg-slate-100"
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      className="absolute right-0 mt-2 w-56 p-2 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 shadow-xl z-50 text-xs space-y-1"
                    >
                      {/* Identity Header */}
                      <div className="p-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-foreground truncate">
                          {user?.fullName || "Creative Member"}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono truncate">
                          @{user?.username || "creator"}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors font-medium"
                      >
                        <User size={14} className="text-[#1E45FB]" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors font-medium"
                      >
                        <LayoutDashboard size={14} className="text-[#CDF22B]" />
                        <span>Creator Dashboard</span>
                      </Link>

                      <Link
                        to="/create"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors font-medium"
                      >
                        <Plus size={14} className="text-[#CDF22B]" />
                        <span>Upload Project</span>
                      </Link>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors font-medium text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Logged Out State (Sign In & Sign Up) */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full btn-primary text-xs font-bold active:scale-95 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
