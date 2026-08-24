// Helper function to auto-generate logical, clean username from Full Name and Email
export function generateUsernameFromFullName(fullName: string, email: string): string {
  let slug = fullName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!slug || slug.length < 2) {
    const emailPrefix = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_");
    slug = emailPrefix || "creator";
  }

  if (slug.length < 3) {
    slug = `${slug}_${Math.floor(100 + Math.random() * 900)}`;
  }

  return slug;
}
