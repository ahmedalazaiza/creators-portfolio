import { useState, useEffect, useCallback, useMemo } from "react";
import { Profile } from "../types";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { getStorageItem, setStorageItem } from "../../lib/storage";

const LOCAL_STORAGE_CREATORS_KEY = "portfolios_creators_v1";

export function useCreator(usernameOrId?: string) {
  const [creatorsList, setCreatorsList] = useState<Profile[]>(() =>
    getStorageItem<Profile[]>(LOCAL_STORAGE_CREATORS_KEY, [])
  );
  const [loading, setLoading] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_CREATORS_KEY, creatorsList);
  }, [creatorsList]);

  // Fetch real creators from Supabase profiles table
  const refreshCreators = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: Profile[] = data.map((p: any) => ({
          id: p.id,
          username: p.username,
          fullName: p.full_name || p.fullName || "Creative Member",
          headline: p.headline || "Digital Creative & Designer",
          bio: p.bio || "Creator on Portfolios.",
          avatarUrl:
            p.avatar_url ||
            p.avatarUrl ||
            `https://api.dicebear.com/7.x/shapes/svg?seed=${p.username || p.id}`,
          bannerUrl: p.banner_url || p.bannerUrl,
          location: p.location || "Global",
          website: p.website,
          availableForWork: p.available_for_work ?? true,
          skills: p.skills || [],
          socialLinks: p.social_links || {},
          followersCount: p.followers_count || 0,
          followingCount: p.following_count || 0,
          totalAppreciations: p.total_appreciations || 0,
          totalViews: p.total_views || 0,
          isFollowing: false,
          createdAt: p.created_at || new Date().toISOString(),
        }));
        setCreatorsList(mapped);
      }
    } catch (err) {
      console.warn("Supabase fetch error in useCreator:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCreators();
  }, [refreshCreators]);

  // Resolve single creator if usernameOrId provided
  const creator = useMemo(() => {
    if (!usernameOrId) return undefined;
    const clean = usernameOrId.replace(/^@/, "").toLowerCase();
    return creatorsList.find(
      (c) => c.username?.toLowerCase() === clean || c.id === usernameOrId
    );
  }, [creatorsList, usernameOrId]);

  return {
    creatorsList,
    allCreators: creatorsList,
    creator,
    loading,
    refreshCreators,
  };
}

