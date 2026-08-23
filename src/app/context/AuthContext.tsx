import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "portfolios_user_profile";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or construct profile
  const fetchProfile = useCallback(async (userId: string, email?: string) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile && !error) {
        const fullProfile: UserProfile = {
          id: profile.id,
          email: email || profile.email || "",
          username: profile.username || (email ? email.split("@")[0] : "creator"),
          fullName: profile.full_name || profile.username || "Creator",
          avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${profile.username || userId}`,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          createdAt: profile.created_at,
        };
        setUser(fullProfile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fullProfile));
        return;
      }
    } catch (err) {
      console.warn("Supabase fetch profile error:", err);
    }

    // Fallback if profile row not yet created
    if (email) {
      const basicProfile: UserProfile = {
        id: userId,
        email,
        username: email.split("@")[0],
        fullName: email.split("@")[0],
        avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${email}`,
      };
      setUser(basicProfile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(basicProfile));
    }
  }, []);

  // Initialize Session and Listener
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            await fetchProfile(initialSession.user.id, initialSession.user.email);
          } else {
            setSession(null);
            setUser(null);
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          }
        }
      } catch (err) {
        console.warn("Session init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        if (newSession?.user) {
          await fetchProfile(newSession.user.id, newSession.user.email);
        } else {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.session && data.user) {
        setSession(data.session);
        await fetchProfile(data.user.id, data.user.email);
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to sign in" };
    }
  };

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    username: string
  ) => {
    try {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            username: cleanUsername,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Create initial profile in profiles table
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            username: cleanUsername,
            full_name: fullName.trim(),
            email: email.trim(),
            avatar_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${cleanUsername}`,
            created_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Profile upsert error:", dbErr);
        }

        const newProfile: UserProfile = {
          id: data.user.id,
          email: email.trim(),
          username: cleanUsername,
          fullName: fullName.trim(),
          avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${cleanUsername}`,
        };
        setUser(newProfile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to sign up" };
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isLoggedIn: Boolean(user || session),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
