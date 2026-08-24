import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export interface ReportItem {
  id: string;
  targetType: "project" | "comment" | "creator";
  targetId: string;
  targetTitle?: string;
  reporterName?: string;
  reason: string;
  details?: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}

import { getStorageItem, setStorageItem } from "../../lib/storage";

const LOCAL_STORAGE_REPORTS_KEY = "portfolios_reports_v1";

export function useModeration() {
  const [reports, setReports] = useState<ReportItem[]>(() =>
    getStorageItem<ReportItem[]>(LOCAL_STORAGE_REPORTS_KEY, [])
  );

  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_REPORTS_KEY, reports);
  }, [reports]);

  const submitReport = useCallback(
    async (
      targetType: ReportItem["targetType"],
      targetId: string,
      reason: string,
      details?: string,
      targetTitle?: string
    ) => {
      const newReport: ReportItem = {
        id: `rep-${Date.now()}`,
        targetType,
        targetId,
        targetTitle: targetTitle || targetId,
        reason,
        details: details?.trim() || "",
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setReports((prev) => [newReport, ...prev]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from("reports").insert({
            id: newReport.id,
            target_type: targetType,
            target_id: targetId,
            reason,
            details,
            status: "pending",
          });
        } catch (err) {
          console.warn("Supabase submit report error:", err);
        }
      }
    },
    []
  );

  const dismissReport = useCallback((reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "dismissed" } : r))
    );
  }, []);

  const resolveReport = useCallback((reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
    );
  }, []);

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return {
    reports,
    pendingCount,
    submitReport,
    dismissReport,
    resolveReport,
  };
}
