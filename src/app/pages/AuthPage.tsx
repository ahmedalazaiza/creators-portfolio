import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { motion } from "motion/react";
import { Sparkles, ArrowLeft, Loader2, UserCheck, Lock, Mail, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MOCK_CREATORS } from "../data/mockData";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUpInitial = location.pathname === "/signup";

  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signInWithEmail, signUpWithEmail, signInAsDemoUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (!username.trim() || !fullName.trim()) {
          setError("Please provide your full name and creative handle.");
          setLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, username, fullName);
        if (res.error) {
          setError(res.error);
        } else {
          navigate("/dashboard");
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (creatorId: string) => {
    signInAsDemoUser(creatorId);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10"
      >
        {/* Top Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to Explore
        </Link>

        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-block text-4xl text-foreground mb-1"
            style={{ fontFamily: "'Cookie', cursive" }}
          >
            Azaiza<span className="text-primary font-sans">.</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
            {isSignUp ? "Join the Creative Studio" : "Welcome Back"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {isSignUp
              ? "Publish your portfolio and get discovered globally"
              : "Sign in to manage your case studies and appreciations"}
          </p>
        </div>

        {/* Mode Switch Pills */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-muted/40 border border-border mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError("");
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              !isSignUp
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError("");
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              isSignUp
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ahmed Al-Azaiza"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
                  Creative Handle / Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-muted-foreground font-mono text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full pl-8 pr-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs font-mono focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@designers.gallery"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-input-background text-foreground text-xs focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-[0_0_25px_rgba(170,255,56,0.3)] hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignUp ? "Complete Registration" : "Sign In to Studio"}</span>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-8 pt-6 border-t border-border space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
            <Sparkles size={13} className="text-primary" /> Instant Preview Accounts
          </div>
          <p className="text-[11px] text-muted-foreground">
            Click any creator to test the authenticated studio experience instantly:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {MOCK_CREATORS.slice(0, 2).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleDemoLogin(c.id)}
                className="flex items-center gap-2 p-2 rounded-xl border border-border bg-muted/20 hover:bg-primary/10 hover:border-primary/40 text-left transition-all group cursor-pointer"
              >
                <img
                  src={c.avatarUrl}
                  alt={c.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {c.fullName.split(" ")[0]}
                  </div>
                  <div className="text-[9px] text-muted-foreground truncate">
                    {c.skills?.[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
