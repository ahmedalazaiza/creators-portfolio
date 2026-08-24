import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Compass, Search, Plus, Bookmark, User, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { savedCount, favoritesCount } = useProjects(undefined, user?.id);

  const pathname = location.pathname;

  // On Project Detail case study pages, yield to the dedicated ProjectStickyActionBar
  if (pathname.startsWith("/project/") || pathname.startsWith("/p/")) {
    return null;
  }

  const isExplore = pathname === "/" || pathname === "/explore" || pathname === "/inspiration";
  const isSearch = pathname === "/search";
  const isSaved = pathname === "/saved";
  const isProfile =
    pathname === "/profile" ||
    (user && (pathname === `/@${user.username}` || pathname === `/u/${user.username}`)) ||
    pathname === "/dashboard" ||
    pathname === "/settings";

  const handleOpenSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-search-modal"));
  };

  const handleCreateProject = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/create" } });
    } else {
      navigate("/create");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] pt-1">
      <nav
        aria-label="Mobile navigation bar"
        className="pointer-events-auto max-w-md mx-auto bg-white/92 dark:bg-[#12150f]/92 backdrop-blur-2xl border border-slate-200/90 dark:border-white/12 rounded-[28px] p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.75)]"
      >
        <div className="flex items-center justify-between gap-1">
          {/* 1. Explore (Home) */}
          <Link
            to="/"
            aria-label="Explore Projects"
            className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
              isExplore
                ? "bg-slate-100/90 dark:bg-white/10 text-slate-950 dark:text-[#CDF22B] font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Compass
                size={21}
                className={isExplore ? "stroke-[2.5]" : "stroke-[1.85]"}
              />
              {isExplore && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-slate-950 dark:bg-[#CDF22B]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none">
              Explore
            </span>
          </Link>

          {/* 2. Search Modal Trigger */}
          <button
            onClick={handleOpenSearch}
            aria-label="Search & Filter"
            className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
              isSearch
                ? "bg-slate-100/90 dark:bg-white/10 text-slate-950 dark:text-[#CDF22B] font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Search
                size={21}
                className={isSearch ? "stroke-[2.5]" : "stroke-[1.85]"}
              />
              {isSearch && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-slate-950 dark:bg-[#CDF22B]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none">
              Search
            </span>
          </button>

          {/* 3. Center Hero: Create / Upload Project */}
          <button
            onClick={handleCreateProject}
            aria-label="Upload New Project"
            className="flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 group cursor-pointer select-none active:scale-90"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#CDF22B] text-slate-950 flex items-center justify-center shadow-md shadow-[#CDF22B]/25 group-hover:scale-105 transition-transform font-bold border border-[#CDF22B]/40">
              <Plus size={22} strokeWidth={2.6} />
            </div>
            <span className="text-[9px] font-bold text-foreground mt-0.5 tracking-tight leading-none">
              Upload
            </span>
          </button>

          {/* 4. Saved Collections */}
          <Link
            to="/saved"
            aria-label="Saved Collections"
            className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all cursor-pointer select-none active:scale-90 relative ${
              isSaved
                ? "bg-slate-100/90 dark:bg-white/10 text-slate-950 dark:text-[#CDF22B] font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Bookmark
                size={21}
                className={isSaved ? "fill-current stroke-[2]" : "stroke-[1.85]"}
              />
              {isLoggedIn && savedCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[9px] font-mono font-bold flex items-center justify-center border border-white dark:border-slate-900 shadow-xs leading-none">
                  {savedCount > 99 ? "99+" : savedCount}
                </span>
              )}
              {isSaved && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-slate-950 dark:bg-[#CDF22B]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none">
              Saved
            </span>
          </Link>

          {/* 5. Creator Profile / Sign In */}
          <Link
            to={isLoggedIn ? (user?.username ? `/@${user.username}` : "/profile") : "/login"}
            aria-label={isLoggedIn ? "My Profile" : "Sign In"}
            className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
              isProfile
                ? "bg-slate-100/90 dark:bg-white/10 text-slate-950 dark:text-[#CDF22B] font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <div className="relative flex items-center justify-center">
              {isLoggedIn && user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || "User"}
                  className={`w-5 h-5 rounded-full object-cover bg-slate-200 dark:bg-slate-800 transition-all ${
                    isProfile
                      ? "ring-2 ring-slate-950 dark:ring-[#CDF22B] shadow-xs"
                      : "border border-slate-300 dark:border-white/20"
                  }`}
                />
              ) : (
                <User
                  size={21}
                  className={isProfile ? "stroke-[2.5]" : "stroke-[1.85]"}
                />
              )}
              {isProfile && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-slate-950 dark:bg-[#CDF22B]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none">
              {isLoggedIn ? "Profile" : "Sign In"}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
