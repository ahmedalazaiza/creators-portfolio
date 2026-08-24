import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Send,
  Inbox,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp, isLoggedIn, resendVerificationEmail } = useAuth();

  const isSignUpPath = location.pathname === "/signup";
  const [isSignUp, setIsSignUp] = useState(isSignUpPath);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // Sync with URL route changes
  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
    setErrorMessage("");
    setSuccessMessage("");
    setEmailVerificationPending(false);
  }, [location.pathname]);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && !emailVerificationPending) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, location.state, emailVerificationPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMessage("Please enter your full name.");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage("Password must be at least 6 characters long.");
          setLoading(false);
          return;
        }

        const res = await signUp(email, password, fullName);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setRegisteredEmail(email.trim());
          if (res.needsEmailVerification) {
            setEmailVerificationPending(true);
          } else {
            setSuccessMessage("Account created successfully! Welcome aboard.");
            setTimeout(() => {
              const from = (location.state as any)?.from?.pathname || "/dashboard";
              navigate(from, { replace: true });
            }, 700);
          }
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          const from = (location.state as any)?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendFromScreen = async () => {
    if (!registeredEmail) return;
    setResending(true);
    try {
      const res = await resendVerificationEmail(registeredEmail);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage("Verification link resent! Please check your email.");
      }
    } catch {
      setErrorMessage("Failed to resend verification link.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Soft Ambient Brand Glow in Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CDF22B]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-200/40 dark:bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full relative z-10 border border-white/80 dark:border-slate-800/80 shadow-2xl space-y-6"
      >
        {/* Verification Pending Screen */}
        {emailVerificationPending ? (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#CDF22B]/20 text-slate-950 dark:text-[#CDF22B] flex items-center justify-center mx-auto shadow-inner">
              <Inbox size={30} />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
                Check Your Email
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We've sent a verification link to <strong className="text-foreground">{registeredEmail}</strong>. Please click the link to activate your account and publish projects.
              </p>
            </div>

            {successMessage && (
              <div className="p-3 rounded-2xl bg-[#CDF22B]/20 border border-[#CDF22B]/50 text-slate-950 dark:text-[#CDF22B] text-xs flex items-center gap-2 font-medium justify-center">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-[#CDF22B]" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 justify-center">
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 rounded-full btn-primary font-bold text-xs shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Dashboard</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={handleResendFromScreen}
                disabled={resending}
                className="w-full py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
                <span>Resend Verification Email</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Logo & Headline */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#CDF22B] text-slate-900 flex items-center justify-center mx-auto shadow-md shadow-[#CDF22B]/30 font-bold">
                <Sparkles size={22} />
              </div>

              <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
                {isSignUp ? "Create Your Account" : "Welcome Back"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isSignUp
                  ? "Join a calm, creative community to publish and explore work"
                  : "Sign in to access your creator studio and manage projects"}
              </p>
            </div>

            {/* Tab Switcher (Log In / Sign Up) */}
            <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/50">
              <Link
                to="/login"
                className={`flex-1 py-2 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  !isSignUp
                    ? "bg-white dark:bg-slate-900 text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className={`flex-1 py-2 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSignUp
                    ? "bg-white dark:bg-slate-900 text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </Link>
            </div>

            {/* Error / Success Feedback */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 rounded-2xl bg-[#CDF22B]/20 border border-[#CDF22B]/50 text-slate-900 dark:text-[#CDF22B] text-xs flex items-start gap-2.5 font-medium"
                >
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-[#CDF22B]" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="block text-xs font-semibold text-foreground">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User size={16} className="absolute left-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ahmed Al-Azaiza"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-foreground text-xs focus:outline-none focus:border-[#CDF22B] focus:ring-2 focus:ring-[#CDF22B]/30 transition-all font-medium"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-foreground text-xs focus:outline-none focus:border-[#CDF22B] focus:ring-2 focus:ring-[#CDF22B]/30 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-foreground text-xs focus:outline-none focus:border-[#CDF22B] focus:ring-2 focus:ring-[#CDF22B]/30 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-full btn-primary font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin text-slate-900" />
                ) : (
                  <>
                    <span>{isSignUp ? "Create Free Account" : "Sign In to Portfolios"}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Footer info */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[11px] text-muted-foreground">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-slate-900 dark:text-[#CDF22B] font-bold hover:underline cursor-pointer"
                    >
                      Log In
                    </Link>
                  </>
                ) : (
                  <>
                    Don't have an account yet?{" "}
                    <Link
                      to="/signup"
                      className="text-slate-900 dark:text-[#CDF22B] font-bold hover:underline cursor-pointer"
                    >
                      Create one for free
                    </Link>
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
