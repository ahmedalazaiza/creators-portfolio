import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { generateUsernameFromFullName } from "../../lib/authUtils";

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
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isEmailVerified: boolean;
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error?: string; needsEmailVerification?: boolean }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (targetEmail?: string) => Promise<{ error?: string; success?: boolean }>;
  refreshSession: () => Promise<{ verified: boolean; user?: UserProfile | null }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "portfolios_user_profile_v3";

/**
 * Helper to determine email verification status from Supabase Auth User or profiles row
 */
export function isUserEmailVerified(
  authUser?: User | null,
  profileRow?: { is_email_verified?: boolean } | null
): boolean {
  if (profileRow?.is_email_verified === true) return true;
  if (!authUser) return false;
  return Boolean(
    authUser.email_confirmed_at ||
      authUser.confirmed_at ||
      (authUser.user_metadata as any)?.email_verified ||
      (authUser.user_metadata as any)?.is_email_verified
  );
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial cached user profile for instant hydration without flicker
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Derive verification status from user profile and active session
  const isEmailVerified = useMemo(() => {
    if (user?.isEmailVerified === true) return true;
    if (session?.user) return isUserEmailVerified(session.user);
    return false;
  }, [user?.isEmailVerified, session?.user]);

  /**
   * Fetches or creates the user's profile row in Supabase
   */
  const fetchProfile = useCallback(
    async (
      userId: string,
      email?: string,
      fallbackMeta?: any,
      authUser?: User | null
    ): Promise<UserProfile | null> => {
      if (!isSupabaseConfigured) return null;

      try {
        let profile: any = null;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

        if (isUuid) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();
          if (!error && data) profile = data;
        }

        if (!profile && email) {
          const usernamePrefix = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .ilike("username", usernamePrefix)
            .maybeSingle();
          if (data) profile = data;
        }

        const verified = isUserEmailVerified(authUser, profile);

        if (profile) {
          // If DB says not verified but authUser is verified, update DB profile row
          if (verified && !profile.is_email_verified && isUuid) {
            supabase
              .from("profiles")
              .update({ is_email_verified: true, updated_at: new Date().toISOString() })
              .eq("id", profile.id)
              .then(() => {});
          }

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
            isEmailVerified: verified,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at,
          };

          setUser(fullProfile);
          try {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fullProfile));
          } catch {}
          return fullProfile;
        } else {
          // Profile row doesn't exist yet: create it cleanly
          const generatedUsername =
            fallbackMeta?.username ||
            generateUsernameFromFullName(fallbackMeta?.full_name || "Creator", email || "");
          const fullName =
            fallbackMeta?.full_name ||
            fallbackMeta?.fullName ||
            (email ? email.split("@")[0] : "Creator");
          const avatarUrl =
            fallbackMeta?.avatar_url ||
            `https://api.dicebear.com/7.x/shapes/svg?seed=${generatedUsername}`;

          const newProfileData: UserProfile = {
            id: userId,
            email: email || "",
            username: generatedUsername,
            fullName,
            avatarUrl,
            headline: "Creative Designer",
            bio: "Crafting digital experiences and visual design systems.",
            location: "Global",
            website: "portfolios.space",
            availableForWork: true,
            skills: ["Design Systems", "UI/UX"],
            isEmailVerified: verified,
            createdAt: new Date().toISOString(),
          };

          if (isUuid) {
            try {
              await supabase.from("profiles").upsert({
                id: userId,
                username: generatedUsername,
                full_name: fullName,
                avatar_url: avatarUrl,
                is_email_verified: verified,
                created_at: new Date().toISOString(),
              });
            } catch (upsertErr) {
              console.warn("Profile auto-upsert notice:", upsertErr);
            }
          }

          setUser(newProfileData);
          try {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfileData));
          } catch {}
          return newProfileData;
        }
      } catch (err) {
        console.warn("Supabase fetch profile error:", err);
        return null;
      }
    },
    []
  );

  /**
   * Force Refresh Session & Check Live Email Verification
   * Can be called from banners, modals, and tab visibility/focus listeners
   */
  const refreshSession = useCallback(async (): Promise<{ verified: boolean; user?: UserProfile | null }> => {
    if (!isSupabaseConfigured) return { verified: false, user: null };

    try {
      // 1. Fetch live session and user directly from Supabase Auth server
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (!userError && userData?.user) {
        const freshUser = userData.user;
        const verified = isUserEmailVerified(freshUser);

        // Also refresh session tokens to keep JWT up-to-date
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          setSession(sessionData.session);
        }

        // Sync to profiles table if verified
        if (verified) {
          await supabase
            .from("profiles")
            .update({ is_email_verified: true, updated_at: new Date().toISOString() })
            .eq("id", freshUser.id);
        }

        const updatedProfile = await fetchProfile(
          freshUser.id,
          freshUser.email,
          freshUser.user_metadata,
          freshUser
        );

        return { verified, user: updatedProfile };
      }

      // 2. Fallback check from DB if user state exists
      if (user?.id) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
        let q = supabase.from("profiles").select("*");
        if (isUuid) q = q.eq("id", user.id);
        else q = q.eq("username", user.username);
        const { data: dbProfile } = await q.maybeSingle();

        if (dbProfile?.is_email_verified === true) {
          setUser((prev) => {
            if (!prev) return null;
            const next = { ...prev, isEmailVerified: true };
            try {
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(next));
            } catch {}
            return next;
          });
          return { verified: true, user };
        }
      }

      return { verified: false, user: null };
    } catch (err) {
      console.warn("Session refresh error:", err);
      return { verified: false, user: null };
    }
  }, [user, fetchProfile]);

  /**
   * Initialize Session & real-time Auth State Listener
   */
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (!isSupabaseConfigured) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const {
          data: { session: activeSession },
        } = await supabase.auth.getSession();

        if (isMounted) {
          if (activeSession?.user) {
            setSession(activeSession);
            await fetchProfile(
              activeSession.user.id,
              activeSession.user.email,
              activeSession.user.user_metadata,
              activeSession.user
            );
          } else {
            // No active Supabase session: clear local cached user to prevent stale auth states
            setUser(null);
            setSession(null);
            try {
              localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Session initialization error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
      if (!isMounted) return;

      setSession(newSession);

      if (newSession?.user) {
        await fetchProfile(
          newSession.user.id,
          newSession.user.email,
          newSession.user.user_metadata,
          newSession.user
        );
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        try {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        } catch {}
      }

      setLoading(false);
    });

    // Auto-sync email verification status when the user switches tabs back to this window
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        refreshSession();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [fetchProfile, refreshSession]);

  /**
   * Sign In with Email & Password
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !password) {
        return { error: "Please enter your email and password." };
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          let msg = error.message;

          if (
            msg.includes("Invalid login credentials") ||
            msg.includes("invalid_grant") ||
            msg.includes("invalid_credentials")
          ) {
            msg = "Invalid email address or password. Please check your credentials.";
          } else if (msg.includes("Email not confirmed")) {
            msg = "Please verify your email address before signing in, or use the resend verification link.";
          } else if (msg.includes("rate limit") || msg.includes("too many requests")) {
            msg = "Too many sign-in attempts. Please wait a moment before trying again.";
          }

          return { error: msg };
        }

        if (data.session && data.user) {
          setSession(data.session);
          await fetchProfile(
            data.user.id,
            data.user.email,
            data.user.user_metadata,
            data.user
          );
        }

        return {};
      } catch (err: any) {
        return {
          error: err.message || "An unexpected error occurred during sign in. Please try again.",
        };
      }
    },
    [fetchProfile]
  );

  /**
   * Sign Up with Email, Password, and Full Name
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string
    ): Promise<{ error?: string; needsEmailVerification?: boolean }> => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanFullName = fullName.trim();

      if (!cleanFullName) {
        return { error: "Please enter your full name." };
      }

      if (!cleanEmail || !cleanEmail.includes("@")) {
        return { error: "Please enter a valid email address." };
      }

      if (password.length < 6) {
        return { error: "Password must be at least 6 characters long." };
      }

      try {
        const baseUsername = generateUsernameFromFullName(cleanFullName, cleanEmail);
        let uniqueUsername = baseUsername;

        if (isSupabaseConfigured) {
          try {
            const { data: existing } = await supabase
              .from("profiles")
              .select("id")
              .eq("username", uniqueUsername)
              .maybeSingle();

            if (existing) {
              uniqueUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
            }
          } catch {
            // Ignore collision check notice
          }
        }

        const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${uniqueUsername}`;

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanFullName,
              username: uniqueUsername,
              avatar_url: avatarUrl,
            },
            emailRedirectTo:
              typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
          },
        });

        if (error) {
          let msg = error.message;
          if (
            msg.includes("User already registered") ||
            msg.includes("already exists") ||
            msg.includes("unique_email")
          ) {
            msg = "An account with this email address already exists. Please log in instead.";
          } else if (msg.includes("rate limit") || msg.includes("too many requests")) {
            msg = "Too many sign-up attempts. Please wait a moment before trying again.";
          }
          return { error: msg };
        }

        if (data.user) {
          const isVerified = isUserEmailVerified(data.user);

          // Create profile record in database
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              username: uniqueUsername,
              full_name: cleanFullName,
              avatar_url: avatarUrl,
              is_email_verified: isVerified,
              created_at: new Date().toISOString(),
            });
          } catch (dbErr) {
            console.warn("Profile table insert notice:", dbErr);
          }

          const newProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            username: uniqueUsername,
            fullName: cleanFullName,
            avatarUrl,
            headline: "Creative Designer",
            bio: "Crafting digital experiences and visual design systems.",
            location: "Global",
            website: "portfolios.space",
            availableForWork: true,
            skills: ["Design Systems", "UI/UX"],
            isEmailVerified: isVerified,
            createdAt: new Date().toISOString(),
          };

          setUser(newProfile);
          try {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
          } catch {}

          if (data.session) {
            setSession(data.session);
          }

          if (!isVerified) {
            return { needsEmailVerification: true };
          }
        }

        return {};
      } catch (err: any) {
        return {
          error: err.message || "Failed to create account. Please try again.",
        };
      }
    },
    []
  );

  /**
   * Resend Verification Email
   */
  const resendVerificationEmail = useCallback(
    async (targetEmail?: string): Promise<{ error?: string; success?: boolean }> => {
      const emailToSend = targetEmail || user?.email || session?.user?.email;
      if (!emailToSend) {
        return { error: "No email address found to send verification link." };
      }

      try {
        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.resend({
            type: "signup",
            email: emailToSend,
            options: {
              emailRedirectTo:
                typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
            },
          });

          if (error) {
            let msg = error.message;
            if (msg.includes("rate limit") || msg.includes("too many requests")) {
              msg = "Verification email recently sent. Please wait a minute before requesting another.";
            }
            return { error: msg };
          }
        }
        return { success: true };
      } catch (err: any) {
        return { error: err.message || "Failed to resend verification email." };
      }
    },
    [user?.email, session?.user?.email]
  );

  /**
   * Sign Out
   */
  const signOut = useCallback(async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Sign out note:", err);
    } finally {
      setUser(null);
      setSession(null);
      try {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      } catch {}
    }
  }, []);

  /**
   * Refresh Current Profile
   */
  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id, session.user.email, null, session.user);
    } else if (user?.id) {
      await fetchProfile(user.id, user.email);
    }
  }, [session?.user, user?.id, user?.email, fetchProfile]);

  /**
   * Update Profile Details
   */
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
      if (!user) return { error: "No active user session found." };

      try {
        const updatedProfile = { ...user, ...updates, updatedAt: new Date().toISOString() };
        setUser(updatedProfile);
        try {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedProfile));
        } catch {}

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
        return { error: err.message || "Failed to update profile." };
      }
    },
    [user]
  );

  const contextValue = useMemo(
    () => ({
      user,
      session,
      loading,
      isEmailVerified,
      isLoggedIn: Boolean(user || session),
      signIn,
      signUp,
      signOut,
      resendVerificationEmail,
      refreshSession,
      refreshProfile,
      updateProfile,
    }),
    [
      user,
      session,
      loading,
      isEmailVerified,
      signIn,
      signUp,
      signOut,
      resendVerificationEmail,
      refreshSession,
      refreshProfile,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

