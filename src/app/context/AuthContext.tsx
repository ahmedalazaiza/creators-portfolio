import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  bannerUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  availableForWork?: boolean;
  skills?: string[];
  socialLinks?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    username: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "portfolios_user_profile_v2";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
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

  // Fetch or create profile row in Supabase
  const fetchProfile = useCallback(
    async (userId: string, email?: string, fallbackMeta?: any) => {
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
            avatarUrl:
              profile.avatar_url ||
              `https://api.dicebear.com/7.x/shapes/svg?seed=${profile.username || userId}`,
            bannerUrl: profile.banner_url,
            headline: profile.headline || "Creative Designer",
            bio: profile.bio || "Crafting digital experiences and visual design systems.",
            location: profile.location || "Global",
            website: profile.website || "portfolios.space",
            availableForWork: profile.available_for_work ?? true,
            skills: profile.skills || ["Design Systems", "UI/UX"],
            socialLinks: profile.social_links || {},
            createdAt: profile.created_at,
            updatedAt: profile.updated_at,
          };

          setUser(fullProfile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fullProfile));
          return fullProfile;
        } else {
          // If profile row doesn't exist yet, create it safely
          const cleanUsername =
            fallbackMeta?.username || (email ? email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "") : `user_${userId.substring(0, 6)}`);
          const fullName = fallbackMeta?.full_name || fallbackMeta?.fullName || (email ? email.split("@")[0] : "Creator");
          const avatarUrl =
            fallbackMeta?.avatar_url ||
            `https://api.dicebear.com/7.x/shapes/svg?seed=${cleanUsername}`;

          const newProfileData: UserProfile = {
            id: userId,
            email: email || "",
            username: cleanUsername,
            fullName,
            avatarUrl,
            headline: "Creative Designer",
            bio: "Crafting digital experiences and visual design systems.",
            location: "Global",
            website: "portfolios.space",
            availableForWork: true,
            skills: ["Design Systems", "UI/UX"],
            createdAt: new Date().toISOString(),
          };

          try {
            await supabase.from("profiles").upsert({
              id: userId,
              username: cleanUsername,
              full_name: fullName,
              avatar_url: avatarUrl,
              created_at: new Date().toISOString(),
            });
          } catch (upsertErr) {
            console.warn("Profile auto-upsert notice:", upsertErr);
          }

          setUser(newProfileData);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfileData));
          return newProfileData;
        }
      } catch (err) {
        console.warn("Supabase fetch profile error:", err);
      }
    },
    []
  );

  // Initialize Session and Auth state listener
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        if (isMounted) {
          if (activeSession?.user) {
            setSession(activeSession);
            await fetchProfile(
              activeSession.user.id,
              activeSession.user.email,
              activeSession.user.user_metadata
            );
          } else {
            setSession(null);
            setUser(null);
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          }
        }
      } catch (err) {
        console.warn("Session initial verification:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    // Listen to real-time auth changes (Sign in, Sign out, Token refreshed)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        setSession(newSession);
        if (newSession?.user) {
          await fetchProfile(
            newSession.user.id,
            newSession.user.email,
            newSession.user.user_metadata
          );
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setSession(null);
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign In Function
  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes("Invalid login credentials")) {
          msg = "Invalid email address or password. Please check your credentials.";
        } else if (msg.includes("Email not confirmed")) {
          msg = "Please verify your email before signing in, or check your inbox.";
        }
        return { error: msg };
      }

      if (data.session && data.user) {
        setSession(data.session);
        await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "An unexpected sign in error occurred." };
    }
  };

  // Sign Up Function
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    username: string
  ) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      const cleanFullName = fullName.trim();
      const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${cleanUsername}`;

      if (!cleanUsername) {
        return { error: "Please enter a valid alphanumeric username." };
      }

      if (!cleanFullName) {
        return { error: "Please enter your full name." };
      }

      // Check if username already exists in profiles
      if (isSupabaseConfigured) {
        try {
          const { data: existingUser } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", cleanUsername)
            .maybeSingle();

          if (existingUser) {
            return { error: `The username "@${cleanUsername}" is already taken. Please choose another.` };
          }
        } catch {
          // Ignore if table check query fails
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanFullName,
            username: cleanUsername,
            avatar_url: avatarUrl,
          },
        },
      });

      if (error) {
        let msg = error.message;
        if (msg.includes("User already registered")) {
          msg = "An account with this email address already exists. Please log in.";
        }
        return { error: msg };
      }

      if (data.user) {
        // Guarantee profile row in Supabase profiles table
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            username: cleanUsername,
            full_name: cleanFullName,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Profile table insert note:", dbErr);
        }

        const newProfile: UserProfile = {
          id: data.user.id,
          email: cleanEmail,
          username: cleanUsername,
          fullName: cleanFullName,
          avatarUrl,
          headline: "Creative Designer",
          bio: "Crafting digital experiences and visual design systems.",
          location: "Global",
          website: "portfolios.space",
          availableForWork: true,
          skills: ["Design Systems", "UI/UX"],
          createdAt: new Date().toISOString(),
        };

        setUser(newProfile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));

        if (data.session) {
          setSession(data.session);
        }
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to create account. Please try again." };
    }
  };

  // Sign Out Function
  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Sign out note:", err);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  };

  // Refresh Profile
  const refreshProfile = async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id, session.user.email);
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: "No active user session found" };

    try {
      const updatedProfile = { ...user, ...updates, updatedAt: new Date().toISOString() };
      setUser(updatedProfile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedProfile));

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: updates.fullName,
            headline: updates.headline,
            bio: updates.bio,
            location: updates.location,
            website: updates.website,
            avatar_url: updates.avatarUrl,
            banner_url: updates.bannerUrl,
            available_for_work: updates.availableForWork,
            skills: updates.skills,
            social_links: updates.socialLinks,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) return { error: error.message };
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to update profile" };
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
        refreshProfile,
        updateProfile,
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
