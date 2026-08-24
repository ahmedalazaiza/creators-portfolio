import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { getStorageItem, setStorageItem } from "../../lib/storage";

const LOCAL_STORAGE_FOLLOWS_KEY = "portfolios_follows_v1";
const LOCAL_STORAGE_FOLLOWERS_COUNT_KEY = "portfolios_followers_count_v1";
const LOCAL_STORAGE_FOLLOWING_COUNT_KEY = "portfolios_following_count_v1";

export function useSocial(currentUserId?: string) {
  // Map of targetUserId -> boolean (is current user following target)
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(() =>
    getStorageItem<Record<string, boolean>>(LOCAL_STORAGE_FOLLOWS_KEY, {})
  );

  // Map of creatorId -> followers count override
  const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>(() =>
    getStorageItem<Record<string, number>>(LOCAL_STORAGE_FOLLOWERS_COUNT_KEY, {})
  );

  // Map of userId -> following count override
  const [followingCountMap, setFollowingCountMap] = useState<Record<string, number>>(() =>
    getStorageItem<Record<string, number>>(LOCAL_STORAGE_FOLLOWING_COUNT_KEY, {})
  );

  // Save to localStorage
  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_FOLLOWS_KEY, followingMap);
  }, [followingMap]);

  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_FOLLOWERS_COUNT_KEY, followersCountMap);
  }, [followersCountMap]);

  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_FOLLOWING_COUNT_KEY, followingCountMap);
  }, [followingCountMap]);

  // Load follows and own profile counts from Supabase if authenticated
  useEffect(() => {
    if (!isSupabaseConfigured || !currentUserId || currentUserId.startsWith("guest-")) {
      return;
    }

    const loadSupabaseFollows = async () => {
      try {
        const [followsRes, profileRes] = await Promise.all([
          supabase
            .from("follows")
            .select("following_id")
            .eq("follower_id", currentUserId),
          supabase
            .from("profiles")
            .select("following_count, followers_count")
            .eq("id", currentUserId)
            .maybeSingle(),
        ]);

        if (!followsRes.error && followsRes.data) {
          const map: Record<string, boolean> = {};
          followsRes.data.forEach((f: any) => {
            map[f.following_id] = true;
          });
          setFollowingMap((prev) => ({ ...prev, ...map }));

          // Update current user's following count
          const actualFollowingCount =
            profileRes.data?.following_count ?? followsRes.data.length;
          setFollowingCountMap((prev) => ({
            ...prev,
            [currentUserId]: actualFollowingCount,
          }));
        }
      } catch (err) {
        console.warn("Error loading follows from Supabase:", err);
      }
    };

    loadSupabaseFollows();
  }, [currentUserId]);

  // Check if current user is following target creator
  const isFollowing = useCallback(
    (targetCreatorIdOrUsername: string): boolean => {
      const key = targetCreatorIdOrUsername.toLowerCase().replace(/^@/, "");
      return Boolean(followingMap[key] || followingMap[targetCreatorIdOrUsername]);
    },
    [followingMap]
  );

  // Get dynamic followers count with fallback
  const getFollowersCount = useCallback(
    (targetIdOrUsername: string, initialCount = 0): number => {
      const key = targetIdOrUsername.toLowerCase().replace(/^@/, "");
      if (typeof followersCountMap[key] === "number") {
        return followersCountMap[key];
      }
      if (typeof followersCountMap[targetIdOrUsername] === "number") {
        return followersCountMap[targetIdOrUsername];
      }
      return initialCount;
    },
    [followersCountMap]
  );

  // Get dynamic following count with fallback
  const getFollowingCount = useCallback(
    (userIdOrUsername?: string, initialCount = 0): number => {
      if (!userIdOrUsername) return initialCount;
      const key = userIdOrUsername.toLowerCase().replace(/^@/, "");
      if (typeof followingCountMap[key] === "number") {
        return followingCountMap[key];
      }
      if (typeof followingCountMap[userIdOrUsername] === "number") {
        return followingCountMap[userIdOrUsername];
      }
      return initialCount;
    },
    [followingCountMap]
  );

  // Live following count for current active user
  const liveFollowingCount = useMemo(() => {
    if (!currentUserId) return 0;
    return getFollowingCount(currentUserId, 0);
  }, [currentUserId, getFollowingCount]);

  // Toggle follow
  const toggleFollow = useCallback(
    async (
      targetCreator: { id: string; username: string; followersCount?: number },
      userId?: string
    ): Promise<{ nextState: boolean; error?: string }> => {
      if (!userId || userId.startsWith("guest-")) {
        return { nextState: false, error: "AUTH_REQUIRED" };
      }

      // Prevent following yourself
      if (targetCreator.id === userId) {
        return { nextState: false, error: "CANNOT_FOLLOW_SELF" };
      }

      const creatorKey = targetCreator.username.toLowerCase().replace(/^@/, "");
      const currentFollowState = Boolean(followingMap[creatorKey] || followingMap[targetCreator.id]);
      const nextState = !currentFollowState;

      // 1. Update following map
      setFollowingMap((prev) => ({
        ...prev,
        [creatorKey]: nextState,
        [targetCreator.id]: nextState,
      }));

      // 2. Update target creator's followers count
      const currentFollowersCount =
        typeof followersCountMap[creatorKey] === "number"
          ? followersCountMap[creatorKey]
          : targetCreator.followersCount || 0;
      const nextFollowersCount = Math.max(0, currentFollowersCount + (nextState ? 1 : -1));

      setFollowersCountMap((prev) => ({
        ...prev,
        [creatorKey]: nextFollowersCount,
        [targetCreator.id]: nextFollowersCount,
      }));

      // 3. Update current user's following count
      const currentFollowingCount =
        typeof followingCountMap[userId] === "number"
          ? followingCountMap[userId]
          : 0;
      const nextFollowingCount = Math.max(0, currentFollowingCount + (nextState ? 1 : -1));

      setFollowingCountMap((prev) => ({
        ...prev,
        [userId]: nextFollowingCount,
      }));

      // 4. Sync with Supabase follows and profiles tables
      if (isSupabaseConfigured && userId) {
        try {
          if (nextState) {
            await supabase.from("follows").upsert({
              follower_id: userId,
              following_id: targetCreator.id,
            });
          } else {
            await supabase
              .from("follows")
              .delete()
              .match({ follower_id: userId, following_id: targetCreator.id });
          }

          // Update target creator's followers_count in profiles table
          await supabase
            .from("profiles")
            .update({ followers_count: nextFollowersCount })
            .eq("id", targetCreator.id);

          // Update current user's following_count in profiles table
          await supabase
            .from("profiles")
            .update({ following_count: nextFollowingCount })
            .eq("id", userId);
        } catch (err) {
          console.warn("Supabase follow sync error:", err);
        }
      }

      return { nextState };
    },
    [followingMap, followersCountMap, followingCountMap]
  );

  return {
    followingMap,
    isFollowing,
    getFollowersCount,
    getFollowingCount,
    liveFollowingCount,
    toggleFollow,
  };
}
