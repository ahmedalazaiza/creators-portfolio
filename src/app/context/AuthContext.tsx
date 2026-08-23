import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { Profile } from "../types";
import { MOCK_CREATORS } from "../data/mockData";

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isDemoUser: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, username: string, fullName: string) => Promise<{ error?: string }>;
  signInAsDemoUser: (creatorId?: string) => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "azaiza_gallery_current_user";
const LOCAL_STORAGE_IS_DEMO_KEY = "azaiza_gallery_is_demo";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      setLoading(true);

      // Check if user was in demo mode
      const savedIsDemo = localStorage.getItem(LOCAL_STORAGE_IS_DEMO_KEY) === "true";
      const savedUserData = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

      if (savedIsDemo && savedUserData) {
        try {
          setUser(JSON.parse(savedUserData));
          setIsDemoUser(true);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
      }

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                username: profile.username || session.user.email?.split("@")[0] || "creator",
                fullName: profile.full_name || "Creator",
                headline: profile.headline,
                bio: profile.bio,
                avatarUrl: profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                bannerUrl: profile.banner_url,
                location: profile.location,
                website: profile.website,
                availableForWork: profile.available_for_work ?? true,
                skills: profile.skills || [],
                socialLinks: profile.social_links || {},
                followersCount: 0,
                followingCount: 0,
                totalAppreciations: 0,
                totalViews: 0,
              });
              setIsDemoUser(false);
            }
          }
        } catch (err) {
          console.warn("Supabase session check error:", err);
        }
      } else {
        // By default on initial load in development preview, start as the primary creator if not signed out
        if (savedUserData) {
          try {
            setUser(JSON.parse(savedUserData));
            setIsDemoUser(true);
          } catch {
            setUser(MOCK_CREATORS[0]);
            setIsDemoUser(true);
          }
        } else {
          // Pre-authenticate as default creator for instant full-experience browsing & dashboard access
          setUser(MOCK_CREATORS[0]);
          setIsDemoUser(true);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(MOCK_CREATORS[0]));
          localStorage.setItem(LOCAL_STORAGE_IS_DEMO_KEY, "true");
        }
      }

      setLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              fullName: profile.full_name,
              headline: profile.headline,
              bio: profile.bio,
              avatarUrl: profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
              bannerUrl: profile.banner_url,
              location: profile.location,
              website: profile.website,
              availableForWork: profile.available_for_work ?? true,
              skills: profile.skills || [],
              socialLinks: profile.social_links || {},
            });
            setIsDemoUser(false);
          }
        } else if (!isDemoUser) {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isDemoUser]);

  const signInWithEmail = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      // Find matching mock creator or create temporary session
      const found = MOCK_CREATORS.find(c => c.username.toLowerCase() === email.split("@")[0].toLowerCase());
      const selected = found || {
        ...MOCK_CREATORS[0],
        fullName: email.split("@")[0],
        username: email.split("@")[0],
      };
      setUser(selected);
      setIsDemoUser(true);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(selected));
      localStorage.setItem(LOCAL_STORAGE_IS_DEMO_KEY, "true");
      return {};
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    username: string,
    fullName: string
  ): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      const newProfile: Profile = {
        id: `user-${Date.now()}`,
        username: username.toLowerCase().replace(/\s+/g, "_"),
        fullName: fullName || "New Designer",
        headline: "Creative Designer & Visual Storyteller",
        bio: "Passionate creator exploring modern design, typography, and visual aesthetics.",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        location: "Earth",
        availableForWork: true,
        skills: ["UI/UX", "Visual Design", "Figma"],
        followersCount: 0,
        followingCount: 0,
        totalAppreciations: 0,
        totalViews: 0,
      };
      setUser(newProfile);
      setIsDemoUser(true);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
      localStorage.setItem(LOCAL_STORAGE_IS_DEMO_KEY, "true");
      return {};
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    });

    if (error) return { error: error.message };
    return {};
  };

  const signInAsDemoUser = (creatorId?: string) => {
    const target = MOCK_CREATORS.find(c => c.id === creatorId) || MOCK_CREATORS[0];
    setUser(target);
    setIsDemoUser(true);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(target));
    localStorage.setItem(LOCAL_STORAGE_IS_DEMO_KEY, "true");
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemoUser(false);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_IS_DEMO_KEY);
  };

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    if (isDemoUser || !isSupabaseConfigured) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    } else {
      try {
        await supabase
          .from("profiles")
          .update({
            full_name: updated.fullName,
            headline: updated.headline,
            bio: updated.bio,
            avatar_url: updated.avatarUrl,
            banner_url: updated.bannerUrl,
            location: updated.location,
            website: updated.website,
            available_for_work: updated.availableForWork,
            skills: updated.skills,
            social_links: updated.socialLinks,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      } catch (err) {
        console.error("Failed to update profile on Supabase:", err);
      }
    }
  }, [user, isDemoUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoUser,
        signInWithEmail,
        signUpWithEmail,
        signInAsDemoUser,
        signOut,
        updateProfile,
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
