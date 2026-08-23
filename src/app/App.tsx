import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import CreatorsPage from "./pages/CreatorsPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectEditorPage from "./pages/ProjectEditorPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

export const API_BASE: string =
  (import.meta as any).env?.VITE_API_URL ?? "https://api.yourdomain.com";

function ProfileRedirect() {
  const { user } = useAuth();
  const username = user?.username || "ahmed_azaiza";
  return <Navigate to={`/@${username}`} replace />;
}

function AppContent({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary flex flex-col justify-between">
      {!isAuthPage && <Navbar isDark={isDark} onToggleTheme={onToggleTheme} />}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Explore / Home */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<Navigate to="/" replace />} />
            <Route path="/discover" element={<Navigate to="/" replace />} />

            {/* Dedicated Search & Deep Discovery */}
            <Route path="/search" element={<SearchPage />} />

            {/* Creators Hub */}
            <Route path="/creators" element={<CreatorsPage />} />

            {/* Project Case Study */}
            <Route path="/project/:slug" element={<ProjectDetailPage />} />

            {/* My Profile Shortcut & Creator Profiles */}
            <Route path="/profile" element={<ProfileRedirect />} />
            <Route path="/my-profile" element={<ProfileRedirect />} />
            <Route path="/@:username" element={<CreatorProfilePage />} />
            <Route path="/user/:username" element={<CreatorProfilePage />} />
            <Route path="/creator/:username" element={<CreatorProfilePage />} />

            {/* Authentication */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* Creator Dashboard & Studio */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/new" element={<ProjectEditorPage />} />
            <Route path="/dashboard/edit/:id" element={<ProjectEditorPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />

            {/* Legacy aliases */}
            <Route path="/adashboard" element={<Navigate to="/dashboard" replace />} />

            {/* 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <ScrollToTopButton />}
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : true;
    setIsDark(dark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((d) => !d);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent isDark={isDark} onToggleTheme={toggleTheme} />
      </AuthProvider>
    </BrowserRouter>
  );
}
