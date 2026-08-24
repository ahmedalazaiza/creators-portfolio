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

            {/* 2. Favorites / Liked Projects (Heart Icon - Brand Colored) */}
            <Link
              to="/favorites"
              aria-label="My Favorites"
              title={favoritesCount > 0 ? `My Favorites (${favoritesCount})` : "My Favorites"}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer border ${
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
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-mono font-bold flex items-center justify-center border border-white dark:border-slate-950 shadow-xs leading-none">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>

            {/* 3. Saved Collections / Bookmarks (Bookmark Icon) */}
            <Link
              to="/saved"
              aria-label="Saved Collections"
              title={savedCount > 0 ? `Saved Collections (${savedCount})` : "Saved Collections"}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer border ${
                location.pathname === "/saved"
                  ? "bg-slate-100 dark:bg-[#1e231b] border-slate-300 dark:border-white/20 text-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b] border-transparent"
              }`}
            >
              <Bookmark
                size={17}
                className={location.pathname === "/saved" ? "fill-current text-foreground" : ""}
              />
              {savedCount > 0 && (
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
                          to="/profile"
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
              className="md:hidden border-t border-slate-200 dark:border-white/10 bg-background/95 backdrop-blur-2xl px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto"
            >
              {/* Quick Search Button in Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-[#1e231b] border border-transparent dark:border-white/10 text-xs font-semibold text-foreground cursor-pointer"
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
                  className="block px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  Explore Showcase
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  <div className="flex items-center gap-2">
                    <Heart size={15} className="text-foreground dark:text-[#CDF22B]" />
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
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  <div className="flex items-center gap-2">
                    <Bookmark size={15} className="text-slate-800 dark:text-slate-200" />
                    <span>Saved Collections</span>
                  </div>
                  {savedCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-foreground text-[10px] font-mono font-bold">
                      {savedCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/creators"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  Creators Directory
                </Link>
              </div>

              {/* Expandable Categories Accordion */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-1">
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Creative Categories
                </div>

                {CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
                  const isExpanded = expandedMobileCategory === cat.slug;
                  return (
                    <div key={cat.id} className="rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-100 dark:hover:bg-[#1e231b] text-xs text-foreground font-medium">
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
                        <div className="bg-slate-50/70 dark:bg-[#070905]/70 pl-6 pr-3 py-1.5 space-y-1 text-[11px]">
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

              {/* Company & Support Links */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-1">
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Company & Studio
                </div>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  About Us
                </Link>
                <Link
                  to="/team"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  Our Team
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  Contact & Support
                </Link>
                <Link
                  to="/careers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  <span>Careers</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#CDF22B]/20 text-slate-900 dark:text-[#CDF22B] text-[9px] font-mono font-bold">Hiring</span>
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-[#1e231b]"
                >
                  FAQ & Help
                </Link>
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
