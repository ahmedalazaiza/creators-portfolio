import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import ProjectEditorPage from "./pages/ProjectEditorPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreatorsPage from "./pages/CreatorsPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import BrandAssetsPage from "./pages/BrandAssetsPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFoundPage from "./pages/NotFoundPage";

function PageTitleHandler() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      document.title = "Portfolios — Calm & Modern Creative Showcase";
    } else if (path === "/login") {
      document.title = "Sign In — Portfolios";
    } else if (path === "/signup") {
      document.title = "Create Free Account — Portfolios";
    } else if (path === "/dashboard") {
      document.title = "Creator Dashboard — Portfolios";
    } else if (path === "/settings") {
      document.title = "Account Settings — Portfolios";
    } else if (path === "/create" || path === "/dashboard/new" || path === "/studio/new") {
      document.title = "Upload Project — Portfolios";
    } else if (path.startsWith("/project/") || path.startsWith("/p/")) {
      document.title = "Project Case Study — Portfolios";
    } else if (path.startsWith("/profile") || path.startsWith("/@") || path.startsWith("/u/")) {
      document.title = "Creator Profile — Portfolios";
    } else if (path === "/creators") {
      document.title = "Creators Directory — Portfolios";
    } else if (path === "/search") {
      document.title = "Search & Filter — Portfolios";
    } else if (path === "/privacy") {
      document.title = "Privacy Policy — Portfolios";
    } else if (path === "/terms") {
      document.title = "Terms of Service — Portfolios";
    } else if (path === "/guidelines") {
      document.title = "Showcase Guidelines — Portfolios";
    } else if (path === "/assets" || path === "/brand") {
      document.title = "Brand Assets — Portfolios";
    } else if (path === "/cookies") {
      document.title = "Cookie Preferences — Portfolios";
    } else {
      document.title = "Portfolios";
    }
  }, [location.pathname]);

  return null;
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
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-[#CDF22B]/30 selection:text-slate-900">
      <PageTitleHandler />
      {!isAuthPage && <Navbar isDark={isDark} onToggleTheme={onToggleTheme} />}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* 1. Public Discovery & Feeds */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<HomePage />} />
            <Route path="/inspiration" element={<HomePage />} />
            <Route path="/creators" element={<CreatorsPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* 2. Project Detail Showcase */}
            <Route path="/project/:slug" element={<ProjectDetailPage />} />
            <Route path="/p/:slug" element={<ProjectDetailPage />} />

            {/* 3. Authentication */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* 4. Public Creator Profiles */}
            <Route path="/profile" element={<CreatorProfilePage />} />
            <Route path="/profile/:username" element={<CreatorProfilePage />} />
            <Route path="/u/:username" element={<CreatorProfilePage />} />
            <Route path="/:username" element={<CreatorProfilePage />} />

            {/* 5. Protected Creator Studio & Project Builder */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <ProjectEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/new"
              element={
                <ProtectedRoute>
                  <ProjectEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/studio/new"
              element={
                <ProtectedRoute>
                  <ProjectEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/edit/:id"
              element={
                <ProtectedRoute>
                  <ProjectEditorPage />
                </ProtectedRoute>
              }
            />

            {/* 6. Favorites / Saved Projects */}
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/saved" element={<FavoritesPage />} />

            {/* 7. Static Legal & Community Pages */}
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/assets" element={<BrandAssetsPage />} />
            <Route path="/brand" element={<BrandAssetsPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />

            {/* 7. 404 Fallback */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent isDark={isDark} onToggleTheme={toggleTheme} />
      </BrowserRouter>
    </AuthProvider>
  );
}
