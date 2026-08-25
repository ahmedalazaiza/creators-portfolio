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
  Layout,
  Box,
  Camera,
  PenTool,
  Building,
  Cpu,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import CategoryNavMenu from "./CategoryNavMenu";
import SearchModal from "./SearchModal";
import { CATEGORIES } from "../data/categories";

const MOBILE_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles size={15} />,
  Layout: <Layout size={15} />,
  Layers: <Layers size={15} />,
  Camera: <Camera size={15} />,
  Box: <Box size={15} />,
  PenTool: <PenTool size={15} />,
  Building: <Building size={15} />,
  Cpu: <Cpu size={15} />,
};

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
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 340 }}
              className="relative w-full max-w-lg mx-auto bg-white dark:bg-[#11140e] border-t border-slate-200/90 dark:border-white/15 rounded-t-[32px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh] pb-[max(2rem,env(safe-area-inset-bottom,2rem))]"
            >
              {/* Elastic Drag Handle */}
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/80 dark:border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shadow-xs">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground tracking-tight flex items-center gap-1.5">
                      Portfolios<span className="text-[#CDF22B]">.</span>
                      <span className="text-[10px] font-normal text-muted-foreground px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10">Navigation</span>
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Sheet Content */}
              <div className="overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
                {/* User Profile Card / Guest Welcome Pass */}
                {isLoggedIn ? (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-[#181c15] dark:to-[#12150f] border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName || "User"}
                            className="w-11 h-11 rounded-full object-cover border-2 border-[#CDF22B] shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#CDF22B] text-slate-950 flex items-center justify-center font-bold shrink-0">
                            <User size={20} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground truncate">
                            {user?.fullName || "Creative Member"}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">
                            @{user?.username || "creator"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={user?.username ? `/@${user.username}` : "/profile"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-bold shrink-0 flex items-center gap-1 active:scale-95"
                      >
                        <span>Profile</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-white/10">
                      <Link
                        to="/create"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 rounded-xl btn-primary text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                      >
                        <Plus size={15} />
                        <span>Upload Work</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                      >
                        <LayoutDashboard size={15} />
                        <span>Dashboard</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#CDF22B]/15 via-slate-50 to-white dark:from-[#181c15] dark:via-[#131611] dark:to-[#181c15] border border-slate-200/90 dark:border-white/10 space-y-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] text-[10px] font-bold font-mono mb-1.5">
                        <Sparkles size={11} />
                        <span>PORTFOLIOS NETWORK</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">Showcase your creative work</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Join top designers & get discovered by leading creative studios.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-2.5 rounded-xl btn-primary text-slate-950 text-xs font-bold text-center active:scale-95 shadow-sm"
                      >
                        Sign Up Free
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-2.5 rounded-xl btn-secondary text-xs font-bold text-center active:scale-95"
                      >
                        Log In
                      </Link>
                    </div>
                  </div>
                )}

                {/* 1-Tap Quick Search Bar (Styled like user's search modal) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-foreground cursor-pointer group active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#CDF22B] text-slate-950 flex items-center justify-center shadow-2xs font-bold shrink-0">
                      <Search size={15} />
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground text-xs font-normal">
                      Search projects, creators & tools...
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-white/10 flex items-center justify-center text-muted-foreground shrink-0">
                    <SlidersHorizontal size={13} />
                  </div>
                </button>

                {/* Main Navigation Tiles (2x2 Grid) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161912] border border-slate-200/70 dark:border-white/10 hover:border-[#CDF22B]/40 transition-all active:scale-95 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-white/10 flex items-center justify-center text-foreground group-hover:text-[#CDF22B] shrink-0">
                      <Compass size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground group-hover:text-[#CDF22B] transition-colors">Explore</p>
                      <p className="text-[10px] text-muted-foreground truncate">Curated showcase</p>
                    </div>
                  </Link>

                  <Link
                    to="/creators"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161912] border border-slate-200/70 dark:border-white/10 hover:border-[#CDF22B]/40 transition-all active:scale-95 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-white/10 flex items-center justify-center text-foreground group-hover:text-[#CDF22B] shrink-0">
                      <Users size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground group-hover:text-[#CDF22B] transition-colors">Creators</p>
                      <p className="text-[10px] text-muted-foreground truncate">Designer index</p>
                    </div>
                  </Link>

                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161912] border border-slate-200/70 dark:border-white/10 hover:border-[#CDF22B]/40 transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-white/10 flex items-center justify-center text-foreground group-hover:text-[#CDF22B] shrink-0">
                        <Heart size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground group-hover:text-[#CDF22B] transition-colors">Favorites</p>
                        <p className="text-[10px] text-muted-foreground truncate">Liked projects</p>
                      </div>
                    </div>
                    {isLoggedIn && favoritesCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#CDF22B] text-slate-950 text-[10px] font-mono font-bold shrink-0">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161912] border border-slate-200/70 dark:border-white/10 hover:border-[#CDF22B]/40 transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-white/10 flex items-center justify-center text-foreground group-hover:text-[#CDF22B] shrink-0">
                        <Bookmark size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground group-hover:text-[#CDF22B] transition-colors">Saved</p>
                        <p className="text-[10px] text-muted-foreground truncate">Collections</p>
                      </div>
                    </div>
                    {isLoggedIn && savedCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#CDF22B] text-slate-950 text-[10px] font-mono font-bold shrink-0">
                        {savedCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Creative Disciplines Section */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161912] border border-slate-200/80 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Layers size={13} className="text-[#CDF22B]" />
                      <span>Creative Disciplines</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">7 Categories</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
                      const isExpanded = expandedMobileCategory === cat.slug;
                      return (
                        <div
                          key={cat.id}
                          className="rounded-xl overflow-hidden bg-white dark:bg-[#11140e] border border-slate-200/60 dark:border-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between p-2.5 text-xs text-foreground font-medium">
                            <Link
                              to={`/?category=${cat.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 flex-1 font-semibold hover:text-[#CDF22B] transition-colors"
                            >
                              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-foreground shrink-0">
                                {MOBILE_CATEGORY_ICONS[cat.icon] || <Sparkles size={14} />}
                              </div>
                              <span>{cat.name}</span>
                            </Link>

                            {cat.subCategories && cat.subCategories.length > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedMobileCategory(isExpanded ? null : cat.slug)
                                }
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                              >
                                <ChevronDown
                                  size={15}
                                  className={`transition-transform duration-200 ${
                                    isExpanded ? "rotate-180 text-[#CDF22B]" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Subcategories tags */}
                          {isExpanded && cat.subCategories && (
                            <div className="bg-slate-50/80 dark:bg-[#0a0c07] p-2.5 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap gap-1.5">
                              {cat.subCategories.map((sub) => (
                                <Link
                                  key={sub.id}
                                  to={`/?category=${cat.slug}&sub=${sub.slug}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 hover:bg-[#CDF22B] hover:text-slate-950 dark:hover:bg-[#CDF22B] dark:hover:text-slate-950 text-[11px] font-medium text-muted-foreground hover:font-bold border border-slate-200/50 dark:border-white/5 transition-all"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Company & Studio Links */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161912] border border-slate-200/80 dark:border-white/10 space-y-2">
                  <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Company & Studio
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <Link
                      to="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#11140e] border border-slate-200/50 dark:border-white/5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/team"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#11140e] border border-slate-200/50 dark:border-white/5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      Our Team
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#11140e] border border-slate-200/50 dark:border-white/5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      Contact & Help
                    </Link>
                    <Link
                      to="/faq"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#11140e] border border-slate-200/50 dark:border-white/5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      FAQ & Guidelines
                    </Link>
                    <Link
                      to="/careers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#11140e] border border-slate-200/50 dark:border-white/5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      <span>Careers & Opportunities</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] text-[10px] font-mono font-bold">We're Hiring</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom Action Row: Theme Switcher & Logout */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-xs font-bold text-foreground cursor-pointer transition-colors active:scale-95"
                  >
                    {isDark ? <Sun size={16} className="text-[#CDF22B]" /> : <Moon size={16} />}
                    <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                  </button>

                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer active:scale-95"
                    >
                      <LogOut size={16} />
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
