import { useState, useEffect, useCallback } from "react";
import { Project, ProjectFilters, Comment, Profile } from "../types";
import { MOCK_PROJECTS, MOCK_COMMENTS, MOCK_CREATORS } from "../data/mockData";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const LOCAL_STORAGE_PROJECTS_KEY = "azaiza_gallery_projects_v2";
const LOCAL_STORAGE_COMMENTS_KEY = "azaiza_gallery_comments_v2";
const LOCAL_STORAGE_APPRECIATIONS_KEY = "azaiza_gallery_appreciations";
const LOCAL_STORAGE_SAVES_KEY = "azaiza_gallery_saves";

export function useProjects(filters?: ProjectFilters) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return MOCK_PROJECTS;
      }
    }
    return MOCK_PROJECTS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return MOCK_COMMENTS;
      }
    }
    return MOCK_COMMENTS;
  });

  const [appreciatedMap, setAppreciatedMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_APPRECIATIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [savedMap, setSavedMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SAVES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [loading, setLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  // Load from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function fetchFromSupabase() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(`
            *,
            creator:profiles(*)
          `)
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Project[] = data.map((item: any) => ({
            id: item.id,
            slug: item.slug || item.id,
            title: item.title,
            description: item.description,
            fullDescription: item.full_description,
            category: item.category,
            categoryId: item.category_id,
            coverImage: item.cover_image,
            accentColor: item.accent_color || "#aaff38",
            year: item.year || "2025",
            tools: item.tools || [],
            tags: item.tags || [],
            images: item.images || [],
            creator: item.creator
              ? {
                  id: item.creator.id,
                  username: item.creator.username,
                  fullName: item.creator.full_name,
                  headline: item.creator.headline,
                  bio: item.creator.bio,
                  avatarUrl: item.creator.avatar_url,
                  location: item.creator.location,
                  availableForWork: item.creator.available_for_work,
                }
              : MOCK_CREATORS[0],
            userId: item.user_id,
            status: item.status,
            isFeatured: item.is_featured,
            viewsCount: item.views_count || 0,
            appreciationsCount: item.appreciations_count || 0,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));

          // Merge Supabase projects with mock projects so all rich demo content is always visible
          const combined = [...mapped];
          MOCK_PROJECTS.forEach((mp) => {
            if (!combined.some((p) => p.slug === mp.slug || p.id === mp.id)) {
              combined.push(mp);
            }
          });

          setProjects(combined);
        }
      } catch (err) {
        console.warn("Supabase fetch projects error, using mock fallback:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();
  }, []);

  // Filter & Sort Projects
  const filteredProjects = projects
    .map((p) => ({
      ...p,
      isAppreciated: Boolean(appreciatedMap[p.id]),
      isSaved: Boolean(savedMap[p.id]),
      appreciationsCount: (p.appreciationsCount || 0) + (appreciatedMap[p.id] ? 1 : 0),
    }))
    .filter((project) => {
      if (filters?.category && filters.category !== "all") {
        const matchesCat =
          project.categoryId?.toLowerCase() === filters.category.toLowerCase() ||
          project.category.toLowerCase().includes(filters.category.toLowerCase());
        if (!matchesCat) return false;
      }

      if (filters?.tool && filters.tool.trim()) {
        const matchesTool = project.tools.some((t) =>
          t.toLowerCase().includes(filters.tool!.toLowerCase())
        );
        if (!matchesTool) return false;
      }

      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesSearch =
          project.title.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          project.creator.fullName.toLowerCase().includes(q) ||
          project.creator.username.toLowerCase().includes(q) ||
          project.tags.some((t) => t.toLowerCase().includes(q)) ||
          project.tools.some((t) => t.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const sort = filters?.sortBy || "featured";
      if (sort === "featured") {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.appreciationsCount || 0) - (a.appreciationsCount || 0);
      }
      if (sort === "appreciations") {
        return (b.appreciationsCount || 0) - (a.appreciationsCount || 0);
      }
      if (sort === "views") {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  const getProjectBySlug = useCallback(
    (slug: string): Project | null => {
      const found = projects.find(
        (p) => p.slug?.toLowerCase() === slug.toLowerCase() || p.id === slug
      );
      if (!found) return null;
      return {
        ...found,
        isAppreciated: Boolean(appreciatedMap[found.id]),
        isSaved: Boolean(savedMap[found.id]),
        appreciationsCount:
          (found.appreciationsCount || 0) + (appreciatedMap[found.id] ? 1 : 0),
      };
    },
    [projects, appreciatedMap, savedMap]
  );

  const toggleAppreciation = useCallback((projectId: string) => {
    setAppreciatedMap((prev) => {
      const next = { ...prev, [projectId]: !prev[projectId] };
      localStorage.setItem(LOCAL_STORAGE_APPRECIATIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleSave = useCallback((projectId: string) => {
    setSavedMap((prev) => {
      const next = { ...prev, [projectId]: !prev[projectId] };
      localStorage.setItem(LOCAL_STORAGE_SAVES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const incrementViews = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p
      )
    );
  }, []);

  const getProjectComments = useCallback(
    (projectId: string): Comment[] => {
      return comments.filter((c) => c.projectId === projectId);
    },
    [comments]
  );

  const addComment = useCallback(
    (
      projectId: string,
      user: { id: string; username: string; fullName: string; avatarUrl?: string },
      content: string
    ) => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        projectId,
        userId: user.id,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatarUrl:
            user.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        },
        content,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [newComment, ...prev]);
    },
    []
  );

  const saveProject = useCallback(
    (projectData: Partial<Project>, currentUser?: Profile | null): Project => {
      const id = projectData.id || `project-${Date.now()}`;
      const slug =
        projectData.slug ||
        projectData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
        id;

      const existingIndex = projects.findIndex((p) => p.id === id);

      const creator = currentUser
        ? {
            id: currentUser.id,
            username: currentUser.username,
            fullName: currentUser.fullName,
            headline: currentUser.headline,
            bio: currentUser.bio,
            avatarUrl: currentUser.avatarUrl,
            location: currentUser.location,
            availableForWork: currentUser.availableForWork,
          }
        : MOCK_CREATORS[0];

      const newProject: Project = {
        id,
        slug,
        title: projectData.title || "Untitled Project",
        description: projectData.description || "",
        fullDescription: projectData.fullDescription || "",
        category: projectData.category || "UI/UX Design",
        categoryId: projectData.categoryId || "ui-ux",
        coverImage:
          projectData.coverImage ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        accentColor: projectData.accentColor || "#aaff38",
        year: projectData.year || new Date().getFullYear().toString(),
        tools: projectData.tools || ["Figma"],
        tags: projectData.tags || ["Design"],
        images: projectData.images || [],
        creator,
        userId: currentUser?.id || MOCK_CREATORS[0].id,
        status: projectData.status || "published",
        isFeatured: projectData.isFeatured ?? false,
        viewsCount: projectData.viewsCount || 1,
        appreciationsCount: projectData.appreciationsCount || 0,
        createdAt: projectData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        setProjects((prev) => {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...newProject };
          return updated;
        });
      } else {
        setProjects((prev) => [newProject, ...prev]);
      }

      return newProject;
    },
    [projects]
  );

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  return {
    projects: filteredProjects,
    allProjects: projects.map((p) => ({
      ...p,
      isAppreciated: Boolean(appreciatedMap[p.id]),
      isSaved: Boolean(savedMap[p.id]),
    })),
    loading,
    getProjectBySlug,
    toggleAppreciation,
    toggleSave,
    incrementViews,
    getProjectComments,
    addComment,
    saveProject,
    deleteProject,
  };
}
