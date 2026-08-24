/**
 * Centralized Application Route Constants
 * Single source of truth for all navigation and link paths in the application.
 */

export const ROUTES = {
  HOME: "/",
  EXPLORE: "/explore",
  INSPIRATION: "/inspiration",
  CREATORS: "/creators",
  SEARCH: "/search",
  FAVORITES: "/favorites",
  SAVED: "/saved",
  
  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  
  // Creator Studio & Settings (Protected)
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  CREATE_PROJECT: "/create",
  
  // Project Case Study Details
  PROJECT_DETAIL: (slug: string) => `/project/${slug}`,
  PROJECT_EDIT: (id: string) => `/project/edit/${id}`,
  
  // Creator Profile
  CREATOR_PROFILE: (username: string) => `/@${username.replace(/^@/, "")}`,
  
  // Company & Editorial
  ABOUT: "/about",
  TEAM: "/team",
  CONTACT: "/contact",
  CAREERS: "/careers",
  FAQ: "/faq",
  
  // Legal & Community
  PRIVACY: "/privacy",
  TERMS: "/terms",
  GUIDELINES: "/guidelines",
  BRAND_ASSETS: "/assets",
  COOKIES: "/cookies",
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
