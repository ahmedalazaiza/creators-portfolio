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

/**
 * Upload an image file to Supabase Storage bucket 'project-images'.
 * Falls back to base64 DataURL if storage upload fails or in offline demo mode.
 */
export async function uploadImageToSupabase(
  file: File,
  bucket = "project-images"
): Promise<string> {
  if (!isSupabaseConfigured) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      // If bucket doesn't exist, try bucket 'projects' or fallback to base64
      const { error: fallbackError } = await supabase.storage
        .from("projects")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (fallbackError) {
        console.warn("Storage upload failed, using Data URL fallback:", uploadError.message);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const { data } = supabase.storage.from("projects").getPublicUrl(filePath);
      return data.publicUrl;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.warn("Upload exception, using Data URL fallback:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}