import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://glzpjihumigxxlxtycon.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsenBqaWh1bWlneHhseHR5Y29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDUzOTMsImV4cCI6MjEwMzA4MTM5M30.xQK18d5QcDaNo-74iQBrwvX8Ahkeb0jVrm8-DHnjiRo";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project-ref.supabase.co" &&
  !supabaseUrl.includes("placeholder")
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);