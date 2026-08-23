import { useState, useEffect, useCallback } from "react";
import { Profile } from "../types";
import { MOCK_CREATORS } from "../data/mockData";
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return MOCK_CREATORS;
      }
    }
    return MOCK_CREATORS;
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
      const { data, error } = await supabase.from("profiles").select("*");
      if (!error && data && data.length > 0) {
        const mapped: Profile[] = data.map((p: any) => ({
          id: p.id,
          username: p.username,
          fullName: p.full_name,
          headline: p.headline,
          bio: p.bio,
          avatarUrl: p.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          bannerUrl: p.banner_url,
          location: p.location,
          website: p.website,
          availableForWork: p.available_for_work ?? true,
          skills: p.skills || [],
          socialLinks: p.social_links || {},
          followersCount: p.followers_count || 0,
          followingCount: p.following_count || 0,
        }));

        // Merge with mock creators to keep rich content
        const merged = [...mapped];
        MOCK_CREATORS.forEach((mc) => {
          if (!merged.some((m) => m.username === mc.username || m.id === mc.id)) {
            merged.push(mc);
          }
        });
        setCreatorsList(merged);
      }
    } catch (err) {
      console.warn("Supabase fetch profiles error:", err);
    }
  }, []);

  useEffect(() => {
    refreshCreators();
  }, [refreshCreators]);

  const cleanUsername = usernameOrId?.replace(/^@/, "").toLowerCase();

  const rawCreator: Profile | null = cleanUsername
    ? creatorsList.find(
        (c) =>
          c.username.toLowerCase() === cleanUsername ||
          c.id.toLowerCase() === cleanUsername ||
          c.fullName.toLowerCase().replace(/\s+/g, "") === cleanUsername
      ) || null
    : null;

  const creatorProjects = rawCreator
    ? allProjects.filter(
        (p) => p.userId === rawCreator.id || p.creator?.username === rawCreator.username
      )
    : [];

  const appreciatedProjects = rawCreator
    ? allProjects.filter((p) => p.isAppreciated)
    : [];

  const savedProjects = rawCreator
    ? allProjects.filter((p) => p.isSaved)
    : [];

  const totalAppreciations = creatorProjects.reduce(
    (sum, p) => sum + (p.appreciationsCount || 0),
    0
  );

  const totalViews = creatorProjects.reduce(
    (sum, p) => sum + (p.viewsCount || 0),
    0
  );

  const isFollowing = rawCreator ? Boolean(followingMap[rawCreator.id]) : false;

  const toggleFollow = useCallback(async (creatorId: string, currentUserId?: string) => {
    const willFollow = !followingMap[creatorId];

    setFollowingMap((prev) => {
      const next = { ...prev, [creatorId]: willFollow };
      localStorage.setItem(LOCAL_STORAGE_FOLLOWS_KEY, JSON.stringify(next));
      return next;
    });

    // Update creator follower count in state
    setCreatorsList((prevList) => {
      const updated = prevList.map((c) => {
        if (c.id === creatorId) {
          const currentCount = c.followersCount || 0;
          return {
            ...c,
            followersCount: Math.max(0, currentCount + (willFollow ? 1 : -1)),
          };
        }
        return c;
      });
      localStorage.setItem(LOCAL_STORAGE_CREATORS_KEY, JSON.stringify(updated));
      return updated;
    });

    // Sync with Supabase follows table
    if (isSupabaseConfigured && currentUserId && !currentUserId.startsWith("guest-")) {
      try {
        if (willFollow) {
          await supabase.from("follows").insert({
            follower_id: currentUserId,
            following_id: creatorId,
          });
        } else {
          await supabase
            .from("follows")
            .delete()
            .match({ follower_id: currentUserId, following_id: creatorId });
        }
      } catch (err) {
        console.warn("Supabase follow sync error:", err);
      }
    }
  }, [followingMap]);

  // Compute followers list (creators following this creator)
  const followersList = creatorsList.filter(
    (c) => c.id !== rawCreator?.id
  );

  // Compute following list
  const followingList = creatorsList.filter(
    (c) => Boolean(followingMap[c.id]) && c.id !== rawCreator?.id
  );

  const creator: Profile | null = rawCreator
    ? {
        ...rawCreator,
        totalAppreciations: totalAppreciations || rawCreator.totalAppreciations || 1420,
        totalViews: totalViews || rawCreator.totalViews || 8900,
        followersCount: (rawCreator.followersCount || 240) + (isFollowing ? 1 : 0),
        isFollowing,
      }
    : null;

  return {
    creator,
    creatorProjects,
    appreciatedProjects,
    savedProjects,
    followersList,
    followingList,
    isFollowing,
    toggleFollow,
    refreshCreators,
    allCreators: creatorsList.map((c) => ({
      ...c,
      isFollowing: Boolean(followingMap[c.id]),
    })),
  };
}
