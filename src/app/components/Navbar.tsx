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
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
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
  const { favoritesCount, savedCount } = useProjects(undefined, user?.id);
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

  // Listen to custom event and Cmd+K / Ctrl+K keybinding to open search modal
  useEffect(() => {
    const handleOpenSearch = () => setSearchModalOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("open-search-modal", handleOpenSearch);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-search-modal", handleOpenSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
        <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
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
                    ? "bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-[#1e231b]/60"
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
                    ? "bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-[#1e231b]/60"
                }`}
              >
                Creators
              </Link>

              <Link
                to="/about"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  location.pathname === "/about"
                    ? "bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-[#1e231b]/60"
                }`}
              >
                About
              </Link>
            </nav>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Actions & Auth */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 1. Search Icon Trigger */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Open search and filter modal (⌘K)"
              title="Search & Filter (⌘K)"
              className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b] border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer group shadow-2xs"
            >
              <Search size={17} className="text-foreground group-hover:scale-105 transition-transform" />
            </button>

            {/* 2. Favorites / Liked Projects (Heart Icon - Desktop / Tablet only, hidden on mobile) */}
            <Link
              to="/favorites"
              aria-label="My Favorites"
              title={favoritesCount > 0 ? `My Favorites (${favoritesCount})` : "My Favorites"}
              className={`relative w-10 h-10 hidden sm:flex items-center justify-center rounded-full transition-all cursor-pointer border ${
                location.pathname === "/favorites"
                  ? "bg-slate-100 dark:bg-[#1e231b] border-slate-300 dark:border-white/20 text-[#0F172A] dark:text-[#CDF22B] font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground dark:hover:text-[#CDF22B] hover:bg-slate-100 dark:hover:bg-[#1e231b] border-transparent"
              }`}
            >
              <Heart
                size={17}
                className={
                  location.pathname === "/favorites"
                    ? "fill-current text-[#0F172A] dark:text-[#CDF22B]"
                    : ""
                }
              />
              {isLoggedIn && favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-mono font-bold flex items-center justify-center border border-white dark:border-slate-950 shadow-xs leading-none">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>

            {/* 3. Saved Collections / Bookmarks (Bookmark Icon - Desktop / Tablet only, hidden on mobile) */}
            <Link
              to="/saved"
              aria-label="Saved Collections"
              title={isLoggedIn && savedCount > 0 ? `Saved Collections (${savedCount})` : "Saved Collections"}
              className={`relative w-10 h-10 hidden sm:flex items-center justify-center rounded-full transition-all cursor-pointer border ${
                location.pathname === "/saved"
                  ? "bg-slate-100 dark:bg-[#1e231b] border-slate-300 dark:border-white/20 text-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b] border-transparent"
              }`}
            >
              <Bookmark
                size={17}
                className={location.pathname === "/saved" ? "fill-current text-foreground" : ""}
              />
              {isLoggedIn && savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-mono font-bold flex items-center justify-center border border-white dark:border-slate-950 shadow-xs leading-none">
                  {savedCount > 99 ? "99+" : savedCount}
                </span>
              )}
            </Link>

            {/* 4. Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b] transition-colors cursor-pointer"
            >
              {isDark ? <Sun size={17} className="text-[#CDF22B]" /> : <Moon size={17} />}
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
                    aria-label="User menu"
                    className="w-10 h-10 flex items-center justify-center p-1 rounded-full border border-slate-200 dark:border-white/10 hover:border-[#CDF22B] transition-colors cursor-pointer"
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
                        className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#171915] border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-900/15 dark:shadow-black/70 z-50 text-xs space-y-1"
                      >
                        {/* Identity Header */}
                        <div className="p-2.5 pb-2 border-b border-slate-100 dark:border-white/10">
                          <p className="font-bold text-foreground truncate">
                            {user?.fullName || "Creative Member"}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">
                            @{user?.username || "creator"}
                          </p>
                        </div>

                        <Link
                          to={user?.username ? `/@${user.username}` : "/profile"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground transition-colors font-medium"
                        >
                          <User size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/favorites"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground transition-colors font-medium"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                            <span>My Favorites</span>
                          </div>
                          {favoritesCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-foreground text-[10px] font-mono font-bold">
                              {favoritesCount}
                            </span>
                          )}
                        </Link>

                        <Link
                          to="/saved"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground transition-colors font-medium"
                        >
                          <div className="flex items-center gap-2.5">
                            <Bookmark size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                            <span>Saved Collections</span>
                          </div>
                          {savedCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-foreground text-[10px] font-mono font-bold">
                              {savedCount}
                            </span>
                          )}
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground transition-colors font-medium"
                        >
                          <LayoutDashboard size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                          <span>Creator Dashboard</span>
                        </Link>

                        <Link
                          to="/create"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1e231b] text-foreground transition-colors font-medium"
                        >
                          <Plus size={15} className="text-slate-800 dark:text-slate-200 shrink-0" />
                          <span>Upload Project</span>
                        </Link>

                        <div className="pt-1 border-t border-slate-100 dark:border-white/10">
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
                  className="px-4 py-2 rounded-full btn-secondary text-xs font-semibold"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full btn-primary text-xs font-bold active:scale-95 transition-all shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b] transition-colors cursor-pointer active:scale-90"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bottom Sheet (Rendered outside header to avoid stacking context issues) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[999999] md:hidden flex items-end justify-center p-0 overflow-hidden">
            {/* Dark Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            />

              {/* Bottom Sheet Modal Window */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.98 }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className="relative w-full bg-white dark:bg-[#12150f] border-t border-slate-200/90 dark:border-white/15 rounded-t-[32px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh] pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]"
              >
                {/* Mobile Drag Handle */}
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

                {/* Sheet Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/80 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-xs">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground tracking-tight">Navigation & Explore</h3>
                      <p className="text-[11px] text-muted-foreground">Discover creative craft & categories</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Sheet Content */}
                <div className="overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
                  {/* User Profile Card / Auth CTA */}
                  {isLoggedIn ? (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          {user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName || "User"}
                              className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-white/20 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shrink-0">
                              <User size={18} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-foreground truncate">
                              {user?.fullName || "Creative Member"}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-mono truncate">
                              @{user?.username || "creator"}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={user?.username ? `/@${user.username}` : "/profile"}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-3 py-1.5 rounded-xl btn-secondary text-[11px] font-bold shrink-0"
                        >
                          View Profile
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-white/10">
                        <Link
                          to="/create"
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl btn-primary text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                        >
                          <Plus size={14} />
                          <span>New Project</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300/70 dark:hover:bg-white/15 text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <LayoutDashboard size={14} />
                          <span>Dashboard</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#CDF22B]/15 via-slate-50 to-white dark:from-[#181c15] dark:via-[#131611] dark:to-[#181c15] border border-slate-200 dark:border-white/10 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Join Portfolios Space</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Publish your design case studies & join the benchmark directory.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 py-2 rounded-xl btn-secondary text-xs font-bold text-center"
                        >
                          Log In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 py-2 rounded-xl btn-primary text-slate-950 text-xs font-bold text-center"
                        >
                          Sign Up Free
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* 1-Tap Quick Search Button */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSearchModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-foreground cursor-pointer group active:scale-[0.99] transition-transform"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center shadow-2xs">
                        <Search size={14} className="text-slate-800 dark:text-slate-200" />
                      </div>
                      <span>Search projects, creators & tools...</span>
                    </div>
                    <SlidersHorizontal size={14} className="text-muted-foreground group-hover:text-foreground" />
                  </button>

                  {/* Primary Navigation Chips */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs font-bold text-foreground transition-all active:scale-95"
                    >
                      <Compass size={17} className="text-slate-800 dark:text-[#CDF22B]" />
                      <span>Explore Feed</span>
                    </Link>

                    <Link
                      to="/creators"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs font-bold text-foreground transition-all active:scale-95"
                    >
                      <Users size={17} className="text-slate-800 dark:text-[#CDF22B]" />
                      <span>Creators Directory</span>
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs font-bold text-foreground transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart size={17} className="text-slate-800 dark:text-[#CDF22B]" />
                        <span>My Favorites</span>
                      </div>
                      {isLoggedIn && favoritesCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-mono font-bold leading-none">
                          {favoritesCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/saved"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs font-bold text-foreground transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bookmark size={17} className="text-slate-800 dark:text-[#CDF22B]" />
                        <span>Saved Collections</span>
                      </div>
                      {isLoggedIn && savedCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-mono font-bold leading-none">
                          {savedCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Expandable Creative Categories Accordion */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Creative Disciplines</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">7 Fields</span>
                    </div>

                    <div className="space-y-1">
                      {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
                        const isExpanded = expandedMobileCategory === cat.slug;
                        return (
                          <div key={cat.id} className="rounded-xl overflow-hidden bg-white/70 dark:bg-[#161a12] border border-slate-200/60 dark:border-white/5">
                            <div className="flex items-center justify-between px-3 py-2 text-xs text-foreground font-medium">
                              <Link
                                to={`/?category=${cat.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex-1 font-semibold hover:text-[#CDF22B] transition-colors"
                              >
                                {cat.name}
                              </Link>
                              {cat.subCategories && cat.subCategories.length > 0 && (
                                <button
                                  onClick={() =>
                                    setExpandedMobileCategory(isExpanded ? null : cat.slug)
                                  }
                                  className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${
                                      isExpanded ? "rotate-180 text-[#CDF22B]" : ""
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Subcategories pills */}
                            {isExpanded && cat.subCategories && (
                              <div className="bg-slate-50 dark:bg-[#0c0e0a] px-3 py-2 space-y-1 border-t border-slate-200/50 dark:border-white/5 text-[11px]">
                                {cat.subCategories.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    to={`/?category=${cat.slug}&sub=${sub.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-1 text-muted-foreground hover:text-foreground dark:hover:text-[#CDF22B] transition-colors"
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
                  </div>

                  {/* Company & Support Links */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1.5">
                    <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Company & Studio
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <Link
                        to="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-white/5 font-medium transition-colors"
                      >
                        About Us
                      </Link>
                      <Link
                        to="/team"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-white/5 font-medium transition-colors"
                      >
                        Our Team
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-white/5 font-medium transition-colors"
                      >
                        Contact & Support
                      </Link>
                      <Link
                        to="/faq"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-white/5 font-medium transition-colors"
                      >
                        FAQ & Help
                      </Link>
                      <Link
                        to="/careers"
                        onClick={() => setMobileMenuOpen(false)}
                        className="col-span-2 flex items-center justify-between p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-white/5 font-medium transition-colors"
                      >
                        <span>Careers & Jobs</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] text-[9px] font-mono font-bold">Hiring</span>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Action Row: Theme Switcher & Logout */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-white/10">
                    <button
                      onClick={onToggleTheme}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-foreground cursor-pointer transition-colors"
                    >
                      {isDark ? <Sun size={15} className="text-[#CDF22B]" /> : <Moon size={15} />}
                      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                    </button>

                    {isLoggedIn && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Search & Filter Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
