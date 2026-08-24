import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Compass, Search, Plus, Bookmark, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { savedCount } = useProjects(undefined, user?.id);

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
    pathname === "/login";

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
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#11140e]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-white/10 px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0.6rem))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Explore / Home */}
        <Link
          to="/"
          aria-label="Explore Projects"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 gap-1 transition-colors cursor-pointer ${
            isExplore
              ? "text-slate-950 dark:text-[#CDF22B] font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <Compass size={20} className={isExplore ? "stroke-[2.5]" : "stroke-[1.75]"} />
            {isExplore && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-950 dark:bg-[#CDF22B]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Explore</span>
        </Link>

        {/* 2. Search Modal Trigger */}
        <button
          onClick={handleOpenSearch}
          aria-label="Search & Filter"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 gap-1 transition-colors cursor-pointer ${
            isSearch
              ? "text-slate-950 dark:text-[#CDF22B] font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search size={20} className={isSearch ? "stroke-[2.5]" : "stroke-[1.75]"} />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        {/* 3. Center Hero: Create / Upload Project */}
        <button
          onClick={handleCreateProject}
          aria-label="Upload New Project"
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] -mt-5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#CDF22B] text-slate-950 flex items-center justify-center shadow-lg shadow-[#CDF22B]/30 group-active:scale-90 transition-transform font-bold border-4 border-white dark:border-[#11140e]">
            <Plus size={22} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold text-foreground mt-0.5">Upload</span>
        </button>

        {/* 4. Saved / Collections */}
        <Link
          to="/saved"
          aria-label="Saved Collections"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 gap-1 transition-colors cursor-pointer relative ${
            isSaved
              ? "text-slate-950 dark:text-[#CDF22B] font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <Bookmark size={20} className={isSaved ? "fill-current stroke-[2]" : "stroke-[1.75]"} />
            {isLoggedIn && savedCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {savedCount > 99 ? "99+" : savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Saved</span>
        </Link>

        {/* 5. Creator Profile / Sign In */}
        <Link
          to={isLoggedIn ? (user?.username ? `/@${user.username}` : "/profile") : "/login"}
          aria-label={isLoggedIn ? "My Profile" : "Sign In"}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 gap-1 transition-colors cursor-pointer ${
            isProfile
              ? "text-slate-950 dark:text-[#CDF22B] font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isLoggedIn && user?.avatarUrl ? (
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName || "User"}
                className={`w-5 h-5 rounded-full object-cover bg-slate-200 dark:bg-slate-800 ${
                  isProfile
                    ? "ring-2 ring-slate-950 dark:ring-[#CDF22B]"
                    : "border border-slate-300 dark:border-white/20"
                }`}
              />
            </div>
          ) : (
            <User size={20} className={isProfile ? "stroke-[2.5]" : "stroke-[1.75]"} />
          )}
          <span className="text-[10px] tracking-tight">{isLoggedIn ? "Profile" : "Sign In"}</span>
        </Link>
      </div>
    </nav>
  );
}
