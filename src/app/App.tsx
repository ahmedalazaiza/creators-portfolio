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
    } else if (path === "/create" || path === "/dashboard/new" || path === "/studio/new") {
      document.title = "Upload Project — Portfolios";
    } else if (path.startsWith("/project/") || path.startsWith("/p/")) {
      document.title = "Project Case Study — Portfolios";
    } else if (path.startsWith("/profile") || path.startsWith("/@")) {
      document.title = "Creator Profile — Portfolios";
    } else if (path === "/creators") {
      document.title = "Creators Directory — Portfolios";
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

            {/* 2. Project Detail Showcase */}
            <Route path="/project/:slug" element={<ProjectDetailPage />} />
            <Route path="/p/:slug" element={<ProjectDetailPage />} />

            {/* 3. Authentication */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* 4. Public Creator Profiles */}
            <Route path="/profile" element={<CreatorProfilePage />} />
            <Route path="/@:username" element={<CreatorProfilePage />} />
            <Route path="/u/:username" element={<CreatorProfilePage />} />

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

            {/* 6. 404 Fallback */}
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
    const stored = localStorage.getItem("portfolios_theme");
    const dark = stored ? stored === "dark" : false;
    setIsDark(dark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("portfolios_theme", isDark ? "dark" : "light");
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
