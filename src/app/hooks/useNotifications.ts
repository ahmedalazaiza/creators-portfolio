import { useState, useEffect, useCallback } from "react";
import { NotificationItem } from "../types";
import { useAuth } from "../context/AuthContext";

const LOCAL_STORAGE_NOTIFICATIONS_KEY = "azaiza_gallery_notifications_v3";

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "ahmed-azaiza",
    type: "inquiry",
    actorName: "Sarah Jenkins",
    actorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    title: "New Project Inquiry",
    description: "Sarah Jenkins sent a commission request for Spatial Reality OS interface ($5k - $10k).",
    targetUrl: "/dashboard",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "notif-2",
    userId: "ahmed-azaiza",
    type: "appreciation",
    actorName: "Zaid Al-Khatib",
    actorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    title: "Project Appreciated",
    description: "Zaid appreciated your case study 'Lumina — Spatial Reality OS Interface'.",
    targetUrl: "/project/lumina-spatial-ui",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "notif-3",
    userId: "ahmed-azaiza",
    type: "follow",
    actorName: "Nour Design",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    title: "New Follower",
    description: "Nour Design started following your creative portfolio.",
    targetUrl: "/@nour_creative",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "notif-4",
    userId: "ahmed-azaiza",
    type: "comment",
    actorName: "Elena Rostova",
    actorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    title: "New Case Study Comment",
    description: "Elena commented: 'The glassmorphic lighting tokens in this system are pure perfection!'",
    targetUrl: "/project/lumina-spatial-ui",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "notif-5",
    userId: "ahmed-azaiza",
    type: "curated",
    actorName: "Azaiza Curators",
    actorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    title: "Featured in UI/UX Benchmark",
    description: "Your masterwork 'Chronos — Horological Watch OS' was featured on the Explore front page.",
    targetUrl: "/project/chronos-horology",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function useNotifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return DEFAULT_NOTIFICATIONS;
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const addNotification = useCallback((item: Omit<NotificationItem, "id" | "createdAt" | "isRead">) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };
}
