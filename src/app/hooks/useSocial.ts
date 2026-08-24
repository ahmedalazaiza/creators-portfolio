import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { getStorageItem, setStorageItem } from "../../lib/storage";

const LOCAL_STORAGE_FOLLOWS_KEY = "portfolios_follows_v1";
const LOCAL_STORAGE_FOLLOWERS_COUNT_KEY = "portfolios_followers_count_v1";

export function useSocial(currentUserId?: string) {
  // Map of targetUserId -> boolean (is current user following target)
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(() =>
    getStorageItem<Record<string, boolean>>(LOCAL_STORAGE_FOLLOWS_KEY, {})
  );

  // Map of creatorId -> followers count override
  const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>(() =>
    getStorageItem<Record<string, number>>(LOCAL_STORAGE_FOLLOWERS_COUNT_KEY, {})
  );

  // Save to localStorage
  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_FOLLOWS_KEY, followingMap);
  }, [followingMap]);

  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_FOLLOWERS_COUNT_KEY, followersCountMap);
  }, [followersCountMap]);

  // Load follows from Supabase if authenticated
  useEffect(() => {
    if (!isSupabaseConfigured || !currentUserId || currentUserId.startsWith("guest-")) {
      return;
    }

    const loadSupabaseFollows = async () => {
      try {
        const { data, error } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", currentUserId);

        if (!error && data) {
          const map: Record<string, boolean> = {};
          data.forEach((f: any) => {
            map[f.following_id] = true;
          });
          setFollowingMap((prev) => ({ ...prev, ...map }));
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

      // Update following map
      setFollowingMap((prev) => ({
        ...prev,
        [creatorKey]: nextState,
        [targetCreator.id]: nextState,
      }));

      // Update followers count
      const currentCount =
        typeof followersCountMap[creatorKey] === "number"
          ? followersCountMap[creatorKey]
          : targetCreator.followersCount || 0;
      const nextCount = Math.max(0, currentCount + (nextState ? 1 : -1));

      setFollowersCountMap((prev) => ({
        ...prev,
        [creatorKey]: nextCount,
        [targetCreator.id]: nextCount,
      }));

      // Sync with Supabase follows table
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

          // Update profiles table followers_count
          await supabase
            .from("profiles")
            .update({ followers_count: nextCount })
            .eq("id", targetCreator.id);
        } catch (err) {
          console.warn("Supabase follow sync error:", err);
        }
      }

      return { nextState };
    },
    [followingMap, followersCountMap]
  );

  return {
    followingMap,
    isFollowing,
    getFollowersCount,
    toggleFollow,
  };
}
