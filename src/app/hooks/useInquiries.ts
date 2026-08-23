import { useState, useEffect, useCallback } from "react";
import { Inquiry } from "../types";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useAuth } from "../context/AuthContext";

const LOCAL_STORAGE_INQUIRIES_KEY = "azaiza_gallery_inquiries_v3";

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    creatorId: "ahmed-azaiza",
    clientName: "Sarah Jenkins",
    clientEmail: "sarah@lumina-studios.io",
    companyName: "Lumina Labs San Francisco",
    budgetRange: "$5,000 - $10,000",
    projectTimeline: "2 - 4 Weeks",
    projectBrief: "We loved your Spatial Reality OS interface and would love to commission a 3D interactive design system for our upcoming hardware release.",
    status: "unread",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "inq-2",
    creatorId: "ahmed-azaiza",
    clientName: "Marcus Vance",
    clientEmail: "marcus@vancecreative.de",
    companyName: "Vance Agency Berlin",
    budgetRange: "$10,000+",
    projectTimeline: "1 - 2 Months",
    projectBrief: "Looking for an Art Director to lead the rebrand and 3D motion package for a global fintech client.",
    status: "read",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export function useInquiries() {
  const { user } = useAuth();

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return DEFAULT_INQUIRIES;
      }
    }
    return DEFAULT_INQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(inquiries));
  }, [inquiries]);

  // Send Inquiry
  const sendInquiry = useCallback(
    async (
      creatorId: string,
      data: {
        clientName: string;
        clientEmail: string;
        companyName?: string;
        budgetRange: string;
        projectTimeline: string;
        projectBrief: string;
      }
    ): Promise<Inquiry> => {
      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        creatorId,
        clientName: data.clientName.trim(),
        clientEmail: data.clientEmail.trim(),
        companyName: data.companyName?.trim() || "",
        budgetRange: data.budgetRange,
        projectTimeline: data.projectTimeline,
        projectBrief: data.projectBrief.trim(),
        status: "unread",
        createdAt: new Date().toISOString(),
      };

      setInquiries((prev) => [newInquiry, ...prev]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from("inquiries").insert({
            id: newInquiry.id,
            creator_id: creatorId,
            client_name: newInquiry.clientName,
            client_email: newInquiry.clientEmail,
            company_name: newInquiry.companyName,
            budget_range: newInquiry.budgetRange,
            project_timeline: newInquiry.projectTimeline,
            project_brief: newInquiry.projectBrief,
            status: "unread",
          });
        } catch (err) {
          console.warn("Supabase send inquiry error:", err);
        }
      }

      return newInquiry;
    },
    []
  );

  const markInquiryStatus = useCallback(
    async (inquiryId: string, status: Inquiry["status"]) => {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
      );

      if (isSupabaseConfigured) {
        try {
          await supabase.from("inquiries").update({ status }).eq("id", inquiryId);
        } catch (err) {
          console.warn("Supabase update inquiry error:", err);
        }
      }
    },
    []
  );

  const deleteInquiry = useCallback(
    async (inquiryId: string) => {
      setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));

      if (isSupabaseConfigured) {
        try {
          await supabase.from("inquiries").delete().eq("id", inquiryId);
        } catch (err) {
          console.warn("Supabase delete inquiry error:", err);
        }
      }
    },
    []
  );

  const unreadCount = inquiries.filter((inq) => inq.status === "unread").length;

  return {
    inquiries,
    unreadCount,
    sendInquiry,
    markInquiryStatus,
    deleteInquiry,
  };
}
