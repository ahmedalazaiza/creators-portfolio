import { useState, useEffect, useCallback } from "react";
import { Project, ProjectFilters, Comment, Profile } from "../types";
import { MOCK_PROJECTS, MOCK_COMMENTS, MOCK_CREATORS } from "../data/mockData";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const LOCAL_STORAGE_PROJECTS_KEY = "azaiza_gallery_projects_v3";
const LOCAL_STORAGE_COMMENTS_KEY = "azaiza_gallery_comments_v3";
const LOCAL_STORAGE_APPRECIATIONS_KEY = "azaiza_gallery_appreciations_v3";
const LOCAL_STORAGE_SAVES_KEY = "azaiza_gallery_saves_v3";

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

  // Sync state to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  // Load live data from Supabase
  const refreshProjects = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          creator:profiles(*)
        `)
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
          accentColor: item.accent_color || "#CDF22B",
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
                avatarUrl: item.creator.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                bannerUrl: item.creator.banner_url,
                location: item.creator.location,
                website: item.creator.website,
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

        // Merge with mock projects so richer content is preserved
        const combined = [...mapped];
        MOCK_PROJECTS.forEach((mp) => {
          if (!combined.some((p) => p.slug === mp.slug || p.id === mp.id)) {
            combined.push(mp);
          }
        });

        setProjects(combined);
      }

      // Fetch live comments
      const { data: commentsData } = await supabase
        .from("comments")
        .select(`
          *,
          user:profiles(*)
        `)
        .order("created_at", { ascending: false });

      if (commentsData && commentsData.length > 0) {
        const mappedComments: Comment[] = commentsData.map((c: any) => ({
          id: c.id,
          projectId: c.project_id,
          userId: c.user_id,
          content: c.content,
          createdAt: c.created_at,
          user: c.user
            ? {
                id: c.user.id,
                username: c.user.username,
                fullName: c.user.full_name,
                avatarUrl: c.user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
              }
            : MOCK_CREATORS[0],
        }));

        // Merge comments
        const mergedComments = [...mappedComments];
        MOCK_COMMENTS.forEach((mc) => {
          if (!mergedComments.some((c) => c.id === mc.id)) {
            mergedComments.push(mc);
          }
        });
        setComments(mergedComments);
      }
    } catch (err) {
      console.warn("Supabase load projects error, fallback active:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // Filter & Sort Projects
  const filteredProjects = projects
    .map((p) => ({
      ...p,
      isAppreciated: Boolean(appreciatedMap[p.id]),
      isSaved: Boolean(savedMap[p.id]),
      appreciationsCount: (p.appreciationsCount || 0) + (appreciatedMap[p.id] ? 1 : 0),
    }))
    .filter((project) => {
      // For general exploration feed, show only published projects
      if (project.status === "draft") return false;

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

  // Appreciate (Like) toggle with Supabase sync
  const toggleAppreciation = useCallback(async (projectId: string, currentUserId?: string) => {
    const isCurrentlyLiked = Boolean(appreciatedMap[projectId]);
    const nextState = !isCurrentlyLiked;

    setAppreciatedMap((prev) => {
      const next = { ...prev, [projectId]: nextState };
      localStorage.setItem(LOCAL_STORAGE_APPRECIATIONS_KEY, JSON.stringify(next));
      return next;
    });

    // Update project count in state
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const currentCount = p.appreciationsCount || 0;
          return {
            ...p,
            appreciationsCount: Math.max(0, currentCount + (nextState ? 1 : -1)),
          };
        }
        return p;
      })
    );

    // Sync with Supabase
    if (isSupabaseConfigured && currentUserId) {
      try {
        if (nextState) {
          await supabase.from("appreciations").insert({
            user_id: currentUserId,
            project_id: projectId,
          });
        } else {
          await supabase
            .from("appreciations")
            .delete()
            .match({ user_id: currentUserId, project_id: projectId });
        }
      } catch (err) {
        console.warn("Supabase appreciation sync error:", err);
      }
    }
  }, [appreciatedMap]);

  // Moodboard / Save toggle
  const toggleSave = useCallback((projectId: string) => {
    setSavedMap((prev) => {
      const next = { ...prev, [projectId]: !prev[projectId] };
      localStorage.setItem(LOCAL_STORAGE_SAVES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Increment Views
  const incrementViews = useCallback(async (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p
      )
    );

    if (isSupabaseConfigured) {
      try {
        await supabase.rpc("increment_project_views", { project_id: projectId });
      } catch {
        // Fallback standard update
        try {
          const found = projects.find((p) => p.id === projectId);
          if (found) {
            await supabase
              .from("projects")
              .update({ views_count: (found.viewsCount || 0) + 1 })
              .eq("id", projectId);
          }
        } catch {
          // ignore
        }
      }
    }
  }, [projects]);

  const getProjectComments = useCallback(
    (projectId: string): Comment[] => {
      return comments.filter((c) => c.projectId === projectId);
    },
    [comments]
  );

  // Add Comment with Supabase insert
  const addComment = useCallback(
    async (
      projectId: string,
      user: { id: string; username: string; fullName: string; avatarUrl?: string },
      content: string
    ) => {
      const newCommentId = `comment-${Date.now()}`;
      const newComment: Comment = {
        id: newCommentId,
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

      if (isSupabaseConfigured && user.id && !user.id.startsWith("guest-")) {
        try {
          await supabase.from("comments").insert({
            id: newCommentId,
            project_id: projectId,
            user_id: user.id,
            content,
          });
        } catch (err) {
          console.warn("Supabase add comment error:", err);
        }
      }
    },
    []
  );

  // Delete Comment
  const deleteComment = useCallback(
    async (commentId: string) => {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (isSupabaseConfigured) {
        try {
          await supabase.from("comments").delete().eq("id", commentId);
        } catch (err) {
          console.warn("Supabase delete comment error:", err);
        }
      }
    },
    []
  );

  // Create or Update Project in Supabase + Local State
  const saveProject = useCallback(
    async (projectData: Partial<Project>, currentUser?: Profile | null): Promise<Project> => {
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
        accentColor: projectData.accentColor || "#CDF22B",
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

      // Optimistic update
      if (existingIndex >= 0) {
        setProjects((prev) => {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...newProject };
          return updated;
        });
      } else {
        setProjects((prev) => [newProject, ...prev]);
      }

      // Sync to Supabase
      if (isSupabaseConfigured && currentUser && !currentUser.id.startsWith("guest-")) {
        try {
          const payload = {
            id,
            user_id: currentUser.id,
            title: newProject.title,
            slug: newProject.slug,
            description: newProject.description,
            full_description: newProject.fullDescription,
            category: newProject.category,
            category_id: newProject.categoryId,
            cover_image: newProject.coverImage,
            accent_color: newProject.accentColor,
            year: newProject.year,
            tools: newProject.tools,
            tags: newProject.tags,
            images: newProject.images,
            status: newProject.status,
            is_featured: newProject.isFeatured,
            updated_at: new Date().toISOString(),
          };

          const { error } = await supabase.from("projects").upsert(payload);
          if (error) {
            console.warn("Supabase upsert project error:", error.message);
          }
        } catch (err) {
          console.warn("Failed to persist project to Supabase:", err);
        }
      }

      return newProject;
    },
    [projects]
  );

  // Delete Project
  const deleteProject = useCallback(
    async (projectId: string) => {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));

      if (isSupabaseConfigured) {
        try {
          await supabase.from("projects").delete().eq("id", projectId);
        } catch (err) {
          console.warn("Supabase delete project error:", err);
        }
      }
    },
    []
  );

  return {
    projects: filteredProjects,
    allProjects: projects.map((p) => ({
      ...p,
      isAppreciated: Boolean(appreciatedMap[p.id]),
      isSaved: Boolean(savedMap[p.id]),
    })),
    loading,
    refreshProjects,
    getProjectBySlug,
    toggleAppreciation,
    toggleSave,
    incrementViews,
    getProjectComments,
    addComment,
    deleteComment,
    saveProject,
    deleteProject,
  };
}
