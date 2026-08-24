import { useState, useEffect, useCallback } from "react";
import { NotificationItem } from "../types";
import { useAuth } from "../context/AuthContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const LOCAL_STORAGE_NOTIFICATIONS_KEY = "portfolios_notifications_v1";

export function useNotifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Load real notifications from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id || user.id.startsWith("guest-")) {
      return;
    }

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped: NotificationItem[] = data.map((n: any) => ({
            id: n.id,
            userId: n.user_id,
            type: n.type,
            actorName: n.title,
            title: n.title,
            description: n.description,
            targetUrl: n.target_url || "/dashboard",
            isRead: Boolean(n.is_read),
            createdAt: n.created_at,
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.warn("Supabase notifications fetch error:", err);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      if (isSupabaseConfigured && user?.id && !user.id.startsWith("guest-")) {
        try {
          await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id)
            .eq("user_id", user.id);
        } catch (err) {
          console.warn("Error marking notification as read:", err);
        }
      }
    },
    [user?.id]
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    if (isSupabaseConfigured && user?.id && !user.id.startsWith("guest-")) {
      try {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", user.id);
      } catch (err) {
        console.warn("Error marking all notifications as read:", err);
      }
    }
  }, [user?.id]);

  const clearNotification = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      if (isSupabaseConfigured && user?.id && !user.id.startsWith("guest-")) {
        try {
          await supabase
            .from("notifications")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);
        } catch (err) {
          console.warn("Error deleting notification:", err);
        }
      }
    },
    [user?.id]
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
  };
}
