import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Search,
  Plus,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell,
  MessageSquare,
  Bookmark,
  FolderPlus,
  Compass,
  Flame,
  Award,
  Users,
  Check,
  Heart,
  UserPlus,
  Mail,
} from "lucide-react";
import { useScrolled } from "../hooks/useScrolled";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import SearchModal from "./SearchModal";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const isScrolled = useScrolled(20);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const isHome = location.pathname === "/";

  const mainNavItems = [
    { label: "Explore", path: "/" },
    { label: "Search", path: "/search" },
    { label: "Creators", path: "/creators" },
    { label: "UI/UX", path: "/?category=ui-ux" },
    { label: "3D & Motion", path: "/?category=3d-motion" },
    { label: "Branding", path: "/?category=branding" },
    { label: "Photography", path: "/?category=photography" },
  ];

  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    await signOut();
    navigate("/");
  };

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    setNotificationsOpen(false);
    navigate(notif.targetUrl);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled || menuOpen
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background/80 backdrop-blur-md border-b border-border/40"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-6">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 group text-foreground">
              <span
                className="text-2xl sm:text-3xl text-foreground font-black tracking-tight"
                style={{ fontFamily: "'Cookie', cursive" }}
              >
                Azaiza<span className="text-primary font-sans">.</span>
              </span>
              <span className="hidden md:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-bold">
                PRO
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-5">
              {mainNavItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? isHome && !location.search
                    : location.pathname === item.path ||
                      (item.path.includes("?") &&
                        location.search.includes(item.path.split("?")[1] || "none"));

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`text-xs font-bold transition-colors py-1 relative ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: Global Search Trigger (Behance Style) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted/70 text-muted-foreground text-xs transition-all shadow-inner group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search size={14} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="truncate">Search masterworks, creators, Figma, 3D...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-background border border-border rounded-md shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions, Share Work Button, Notifications, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="md:hidden p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Search size={16} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              {isDark ? <Sun size={15} className="text-[#CDF22B]" /> : <Moon size={15} />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="p-2 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer relative"
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-80 p-3 rounded-2xl border border-border bg-popover shadow-2xl z-50 text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-border font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span>Activity & Alerts</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-bold">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-muted-foreground hover:text-primary transition-colors cursor-pointer font-mono"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-muted-foreground text-xs">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 ${
                              notif.isRead
                                ? "bg-card/40 hover:bg-muted/50 border border-transparent"
                                : "bg-primary/5 hover:bg-primary/10 border border-primary/20 shadow-xs"
                            }`}
                          >
                            <img
                              src={notif.actorAvatar}
                              alt={notif.actorName}
                              className="w-8 h-8 rounded-full object-cover border border-border shrink-0 mt-0.5"
                            />
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p className="text-[11px] font-bold text-foreground truncate">
                                {notif.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                                {notif.description}
                              </p>
                            </div>
                            {!notif.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Share Your Work (Behance Primary Button) */}
            <Link
              to={user ? "/dashboard/new" : "/signup"}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-[0_0_15px_rgba(205,242,43,0.3)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Share Work</span>
            </Link>

            {/* User Profile Avatar / Sign In */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-0.5 rounded-full border border-border hover:border-primary transition-all cursor-pointer"
                title="Account Menu"
              >
                <img
                  src={
                    user?.avatarUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={user?.fullName || "User Profile"}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-56 p-2 rounded-2xl border border-border bg-popover shadow-2xl z-50 text-xs space-y-1"
                  >
                    {/* Identity Header */}
                    <div className="p-2.5 pb-2 border-b border-border">
                      <div className="font-bold text-foreground truncate">
                        {user?.fullName || "Ahmed Al-Azaiza"}
                      </div>
                      <div className="text-[11px] font-mono text-primary truncate">
                        @{user?.username || "ahmed_azaiza"}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-medium"
                    >
                      <User size={14} className="text-primary" />
                      <span>My Behance Profile</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-medium"
                    >
                      <LayoutDashboard size={14} className="text-primary" />
                      <span>Creator Studio & Insights</span>
                    </Link>

                    <Link
                      to="/creators"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-medium"
                    >
                      <Users size={14} className="text-primary" />
                      <span>Discover Creators</span>
                    </Link>

                    <Link
                      to="/dashboard/new"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-medium"
                    >
                      <Plus size={14} className="text-primary" />
                      <span>Publish Project</span>
                    </Link>

                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-medium"
                    >
                      <Settings size={14} className="text-muted-foreground" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="pt-1 border-t border-border">
                      {user ? (
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors font-semibold text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-primary transition-colors font-semibold text-left"
                        >
                          <User size={14} />
                          <span>Sign In / Register</span>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden border-t border-border bg-background px-4 py-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground text-center"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full-Featured Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
