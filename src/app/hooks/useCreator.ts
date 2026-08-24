import { useState, useEffect, useCallback } from "react";
import { Profile } from "../types";
import { useProjects } from "./useProjects";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const LOCAL_STORAGE_FOLLOWS_KEY = "azaiza_gallery_follows_v3";
const LOCAL_STORAGE_CREATORS_KEY = "azaiza_gallery_creators_v3";

export function useCreator(usernameOrId?: string) {
  const { allProjects } = useProjects();

  const [creatorsList, setCreatorsList] = useState<Profile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CREATORS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });

  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_FOLLOWS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Sync to Supabase if configured
  const refreshCreators = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped: Profile[] = data.map((p: any) => ({
          id: p.id,
          username: p.username,
          fullName: p.full_name || p.fullName || "Creative Member",
          headline: p.headline,
          bio: p.bio,
          avatarUrl:
            p.avatar_url ||
            p.avatarUrl ||
            `https://api.dicebear.com/7.x/shapes/svg?seed=${p.username || "user"}`,
          bannerUrl: p.banner_url || p.bannerUrl,
          location: p.location,
          website: p.website,
          availableForWork: p.available_for_work ?? true,
          skills: p.skills || [],
          socialLinks: p.social_links || {},
          followersCount: p.followers_count || 0,
          followingCount: p.following_count || 0,
          totalAppreciations: p.total_appreciations || 0,
          totalViews: p.total_views || 0,
          isFollowing: Boolean(followingMap[p.id] || followingMap[p.username]),
          createdAt: p.created_at,
        }));
        setCreatorsList(mapped);
      }
    } catch (err) {
      console.warn("Supabase fetch error in useCreator:", err);
    }
  }, [followingMap]);

  useEffect(() => {
    refreshCreators();
  }, [refreshCreators]);

  return {
    creatorsList,
    refreshCreators,
  };
}
