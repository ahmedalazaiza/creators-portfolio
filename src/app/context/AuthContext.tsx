import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
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
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error?: string; needsEmailVerification?: boolean }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (targetEmail?: string) => Promise<{ error?: string; success?: boolean }>;
  refreshSession: () => Promise<{ verified: boolean }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "portfolios_user_profile_v3";

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

  // Check email verification status from Supabase Auth User object or profiles table
  const checkEmailVerified = useCallback((authUser?: User | null, profileObj?: any): boolean => {
    if (profileObj?.is_email_verified === true) return true;
    if (!authUser) return false;
    return Boolean(
      authUser.email_confirmed_at ||
      authUser.confirmed_at ||
      (authUser.user_metadata as any)?.email_verified ||
      (authUser.user_metadata as any)?.is_email_verified
    );
  }, []);

  const isEmailVerified = Boolean(
    user?.isEmailVerified === true ||
    checkEmailVerified(session?.user)
  );

  // Fetch or create profile row in Supabase
  const fetchProfile = useCallback(
    async (userId: string, email?: string, fallbackMeta?: any, authUser?: User | null) => {
      if (!isSupabaseConfigured) return;

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

        const verified = checkEmailVerified(authUser, profile);

        if (profile) {
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
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fullProfile));
          return fullProfile;
        } else {
          // If profile row doesn't exist yet, create it safely
          const generatedUsername = fallbackMeta?.username || generateUsernameFromFullName(fallbackMeta?.full_name || "Creator", email || "");
          const fullName = fallbackMeta?.full_name || fallbackMeta?.fullName || (email ? email.split("@")[0] : "Creator");
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

          setUser(newProfileData);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfileData));
          return newProfileData;
        }
      } catch (err) {
        console.warn("Supabase fetch profile error:", err);
      }
    },
    [checkEmailVerified]
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
              activeSession.user.user_metadata,
              activeSession.user
            );
          } else {
            // Check local storage cached user & re-sync verification from DB
            const cachedStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (cachedStr) {
              try {
                const cachedUser = JSON.parse(cachedStr);
                if (cachedUser?.id || cachedUser?.username || cachedUser?.email) {
                  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cachedUser.id);
                  let liveProfile: any = null;

                  if (isUuid) {
                    const { data } = await supabase
                      .from("profiles")
                      .select("*")
                      .eq("id", cachedUser.id)
                      .maybeSingle();
                    liveProfile = data;
                  }

                  if (!liveProfile && cachedUser.username) {
                    const { data } = await supabase
                      .from("profiles")
                      .select("*")
                      .eq("username", cachedUser.username)
                      .maybeSingle();
                    liveProfile = data;
                  }

                  if (liveProfile) {
                    const isNowVerified = liveProfile.is_email_verified === true;
                    const syncedUser: UserProfile = {
                      ...cachedUser,
                      id: liveProfile.id,
                      username: liveProfile.username,
                      fullName: liveProfile.full_name || cachedUser.fullName,
                      avatarUrl: liveProfile.avatar_url || cachedUser.avatarUrl,
                      isEmailVerified: isNowVerified,
                    };
                    setUser(syncedUser);
                    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(syncedUser));
                  }
                }
              } catch {
                // Ignore parse error
              }
            }
          }
        }
      } catch (err) {
        console.warn("Session initial verification:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    // Listen to real-time auth changes (Sign in, Sign out, Token refreshed, Email verification return)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
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
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
        setLoading(false);
      }
    );

    // Auto sync on tab focus or visibility change (e.g. returning after email verification click)
    const syncVerificationStatus = async () => {
      if (!isSupabaseConfigured) return;

      try {
        // 1. Direct Auth server check
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        if (freshUser) {
          const isVerified = checkEmailVerified(freshUser);
          if (isVerified) {
            // Update Supabase profiles table
            await supabase.from("profiles").update({ is_email_verified: true }).eq("id", freshUser.id);
            setUser((prev) => {
              if (!prev) return null;
              const next = { ...prev, isEmailVerified: true };
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(next));
              return next;
            });
            return;
          }
        }

        // 2. Database profiles table check
        const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (cached) {
          const u = JSON.parse(cached);
          if (u?.username || u?.id) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u.id);
            let q = supabase.from("profiles").select("*");
            if (isUuid) q = q.eq("id", u.id);
            else q = q.eq("username", u.username);
            const { data } = await q.maybeSingle();
            if (data && data.is_email_verified === true) {
              setUser((prev) => {
                if (!prev) return null;
                const next = { ...prev, isEmailVerified: true, id: data.id };
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(next));
                return next;
              });
            }
          }
        }
      } catch (e) {
        console.warn("Auto verification check notice:", e);
      }
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        syncVerificationStatus();
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
  }, [fetchProfile, checkEmailVerified]);

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
        // If Supabase has "Confirm email" enabled on the backend, allow user in and read DB verified state
        if (msg.includes("Email not confirmed")) {
          let userProfile: UserProfile | null = null;

          if (isSupabaseConfigured) {
            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .ilike("username", cleanEmail.split("@")[0])
                .maybeSingle();

              if (profile) {
                userProfile = {
                  id: profile.id,
                  email: cleanEmail,
                  username: profile.username,
                  fullName: profile.full_name,
                  avatarUrl: profile.avatar_url,
                  headline: profile.headline || "Creative Designer",
                  bio: profile.bio || "Crafting digital experiences and visual design systems.",
                  location: profile.location || "Global",
                  website: profile.website || "portfolios.space",
                  availableForWork: profile.available_for_work ?? true,
                  skills: profile.skills || ["Design Systems", "UI/UX"],
                  socialLinks: profile.social_links || {},
                  isEmailVerified: profile.is_email_verified === true,
                  createdAt: profile.created_at,
                  updatedAt: profile.updated_at,
                };
              }
            } catch {
              // Ignore
            }
          }

          if (!userProfile) {
            const fallbackUsername = cleanEmail.split("@")[0].replace(/[^a-z0-9_]/g, "_");
            userProfile = {
              id: `unverified_${fallbackUsername}`,
              email: cleanEmail,
              username: fallbackUsername,
              fullName: fallbackUsername,
              avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${fallbackUsername}`,
              headline: "Creative Designer",
              bio: "Crafting digital experiences and visual design systems.",
              location: "Global",
              website: "portfolios.space",
              availableForWork: true,
              skills: ["Design Systems", "UI/UX"],
              isEmailVerified: false,
              createdAt: new Date().toISOString(),
            };
          }

          setUser(userProfile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userProfile));
          return {};
        }

        if (msg.includes("Invalid login credentials")) {
          msg = "Invalid email address or password. Please check your credentials.";
        }
        return { error: msg };
      }

      if (data.session && data.user) {
        setSession(data.session);
        await fetchProfile(data.user.id, data.user.email, data.user.user_metadata, data.user);
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "An unexpected sign in error occurred." };
    }
  };

  // Sign Up Function (Auto-generating unique username based on Full Name)
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanFullName = fullName.trim();

      if (!cleanFullName) {
        return { error: "Please enter your full name." };
      }

      let baseUsername = generateUsernameFromFullName(cleanFullName, cleanEmail);
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
          // Ignore
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
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
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
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            username: uniqueUsername,
            full_name: cleanFullName,
            avatar_url: avatarUrl,
            is_email_verified: false,
            created_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Profile table insert note:", dbErr);
        }

        const isVerified = checkEmailVerified(data.user);

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
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));

        if (data.session) {
          setSession(data.session);
        }

        if (!isVerified) {
          return { needsEmailVerification: true };
        }
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to create account. Please try again." };
    }
  };

  // Resend Email Verification
  const resendVerificationEmail = async (targetEmail?: string) => {
    const emailToSend = targetEmail || user?.email || session?.user?.email;
    if (!emailToSend) return { error: "No email address found to send verification link." };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: emailToSend,
          options: {
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
          },
        });

        if (error) return { error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { error: err.message || "Failed to resend verification email." };
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

  // Force Refresh Session & Email Verification Status
  const refreshSession = async (): Promise<{ verified: boolean }> => {
    if (!isSupabaseConfigured) return { verified: false };

    try {
      // 1. Fetch live Auth User from Supabase Auth Server
      const { data: { user: freshAuthUser } } = await supabase.auth.getUser();
      const isConfirmed = checkEmailVerified(freshAuthUser);

      if (freshAuthUser) {
        // Also refresh session tokens
        const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
        if (refreshedSession) {
          setSession(refreshedSession);
        }

        if (isConfirmed) {
          await supabase.from("profiles").update({ is_email_verified: true }).eq("id", freshAuthUser.id);
        }

        await fetchProfile(
          freshAuthUser.id,
          freshAuthUser.email,
          freshAuthUser.user_metadata,
          freshAuthUser
        );

        return { verified: isConfirmed };
      }

      // 2. Fallback check from DB
      if (user?.id || user?.username) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
        let q = supabase.from("profiles").select("*");
        if (isUuid) q = q.eq("id", user.id);
        else q = q.eq("username", user.username);
        const { data: dbProfile } = await q.maybeSingle();
        if (dbProfile?.is_email_verified === true) {
          setUser((prev) => (prev ? { ...prev, isEmailVerified: true } : null));
          return { verified: true };
        }
      }

      return { verified: false };
    } catch (err) {
      console.warn("Session refresh error:", err);
      return { verified: false };
    }
  };

  // Refresh Profile
  const refreshProfile = async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id, session.user.email, null, session.user);
    } else if (user?.id) {
      await fetchProfile(user.id, user.email);
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
        isEmailVerified,
        signIn,
        signUp,
        signOut,
        resendVerificationEmail,
        refreshSession,
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
