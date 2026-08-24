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
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Layers,
  Bookmark,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import EmailVerificationBanner from "./EmailVerificationBanner";
import CategoryNavMenu from "./CategoryNavMenu";
import SearchModal from "./SearchModal";
import { CATEGORIES } from "../data/categories";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener for showing search trigger in navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to custom event to open search modal from any page component
  useEffect(() => {
    const handleOpenSearch = () => setSearchModalOpen(true);
    window.addEventListener("open-search-modal", handleOpenSearch);
    return () => window.removeEventListener("open-search-modal", handleOpenSearch);
  }, []);

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

  return (
    <>
      <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
        <EmailVerificationBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Identity & Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-[#CDF22B] text-slate-900 flex items-center justify-center shadow-md shadow-[#CDF22B]/20 group-hover:scale-105 transition-transform font-bold">
                <Sparkles size={16} />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Portfolios<span className="text-[#CDF22B]">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  location.pathname === "/"
                    ? "bg-slate-100 dark:bg-slate-800 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                Explore
              </Link>

              {/* Categories Mega Menu */}
              <CategoryNavMenu />

              <Link
                to="/creators"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  location.pathname === "/creators"
                    ? "bg-slate-100 dark:bg-slate-800 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                Creators
              </Link>
            </nav>
          </div>

          {/* Center: Scroll Search & Filter Bar Trigger */}
          <div className="flex-1 max-w-xs sm:max-w-sm hidden sm:flex items-center justify-center">
            <AnimatePresence>
              {(isScrolled || location.pathname !== "/") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -6 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSearchModalOpen(true)}
                  className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-[#CDF22B]/60 text-xs text-muted-foreground hover:text-foreground shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Search size={14} className="text-[#CDF22B] group-hover:scale-110 transition-transform" />
                    <span className="truncate">Search & Filter works...</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal size={12} className="text-muted-foreground group-hover:text-foreground" />
                    <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-[10px] font-mono text-muted-foreground border border-slate-300/40 dark:border-slate-700/50">
                      ⌘K
                    </kbd>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Actions & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile / Compact Search Icon Button (visible always on small screens or when scrolled) */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Open search and filter modal"
              className="sm:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Search size={17} />
            </button>

            {/* Quick Favorites / Moodboard Link */}
            <Link
              to="/favorites"
              aria-label="View Saved Favorites"
              title="Saved Favorites"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Bookmark size={16} />
            </Link>

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
                        className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#0B101B] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/15 dark:shadow-black/60 z-50 text-xs space-y-1"
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
                          <User size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/favorites"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors font-medium"
                        >
                          <Bookmark size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                          <span>My Favorites</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors font-medium"
                        >
                          <LayoutDashboard size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                          <span>Creator Dashboard</span>
                        </Link>

                        <Link
                          to="/create"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors font-medium"
                        >
                          <Plus size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                          <span>Upload Project</span>
                        </Link>

                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors font-medium text-left cursor-pointer"
                          >
                            <LogOut size={15} className="shrink-0" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* Logged Out State */
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

        {/* Mobile Drawer with Category Accordions */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-2xl px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto"
            >
              {/* Quick Search Button in Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-foreground cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search size={15} className="text-slate-800 dark:text-slate-200" />
                  <span>Search & Filter Projects</span>
                </div>
                <SlidersHorizontal size={14} className="text-muted-foreground" />
              </button>

              {/* Main Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Explore Showcase
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Bookmark size={15} className="text-slate-800 dark:text-slate-200" />
                  <span>My Favorites</span>
                </Link>
                <Link
                  to="/creators"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Creators Directory
                </Link>
              </div>

              {/* Expandable Categories Accordion */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Creative Categories
                </div>

                {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
                  const isExpanded = expandedMobileCategory === cat.slug;
                  return (
                    <div key={cat.id} className="rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-foreground font-medium">
                        <Link
                          to={`/?category=${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1"
                        >
                          {cat.name}
                        </Link>
                        {cat.subCategories && cat.subCategories.length > 0 && (
                          <button
                            onClick={() =>
                              setExpandedMobileCategory(isExpanded ? null : cat.slug)
                            }
                            className="p-1 text-muted-foreground hover:text-foreground"
                          >
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Subcategories list */}
                      {isExpanded && cat.subCategories && (
                        <div className="bg-slate-50/70 dark:bg-slate-900/50 pl-6 pr-3 py-1.5 space-y-1 text-[11px]">
                          {cat.subCategories.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/?category=${cat.slug}&sub=${sub.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-1 text-muted-foreground hover:text-[#CDF22B] transition-colors"
                            >
                              • {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search & Filter Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
