import { useState, useEffect, useCallback } from "react";
import { Inquiry } from "../types";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { getStorageItem, setStorageItem } from "../../lib/storage";

const LOCAL_STORAGE_INQUIRIES_KEY = "portfolios_inquiries_v3";

const DEFAULT_INQUIRIES: Inquiry[] = [];

export function useInquiries() {
  const { user } = useAuth();

  const [inquiries, setInquiries] = useState<Inquiry[]>(() =>
    getStorageItem<Inquiry[]>(LOCAL_STORAGE_INQUIRIES_KEY, DEFAULT_INQUIRIES)
  );

  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_INQUIRIES_KEY, inquiries);
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
