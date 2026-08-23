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

const LOCAL_STORAGE_REPORTS_KEY = "azaiza_gallery_reports_v3";

const DEFAULT_REPORTS: ReportItem[] = [
  {
    id: "rep-1",
    targetType: "project",
    targetId: "proj-3",
    targetTitle: "Cyberpunk 2099 — Kinetic Typography Specimen",
    reporterName: "Anonymous Designer",
    reason: "Suspected uncredited 3D asset usage",
    details: "The background wireframe mesh appears to match an uncredited sketchfab model.",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export function useModeration() {
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return DEFAULT_REPORTS;
      }
    }
    return DEFAULT_REPORTS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
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
