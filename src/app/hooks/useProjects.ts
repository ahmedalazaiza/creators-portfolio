import { useState, useEffect, useCallback } from "react";
import { Project, ProjectFilters, CommentItem, Profile } from "../types";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { matchesCategory } from "../data/categories";
import { getStorageItem, setStorageItem } from "../../lib/storage";

const LOCAL_STORAGE_PROJECTS_KEY = "portfolios_real_projects_v1";
const LOCAL_STORAGE_COMMENTS_KEY = "portfolios_real_comments_v1";
const LOCAL_STORAGE_APPRECIATIONS_KEY = "portfolios_real_appreciations_v1";
const LOCAL_STORAGE_SAVES_KEY = "portfolios_real_saves_v1";

export function useProjects(filters?: ProjectFilters, currentUserId?: string) {
  const [projects, setProjects] = useState<Project[]>(() =>
    getStorageItem<Project[]>(LOCAL_STORAGE_PROJECTS_KEY, [])
  );

  const [comments, setComments] = useState<CommentItem[]>(() =>
    getStorageItem<CommentItem[]>(LOCAL_STORAGE_COMMENTS_KEY, [])
  );

  const [appreciatedMap, setAppreciatedMap] = useState<Record<string, boolean>>(() =>
    getStorageItem<Record<string, boolean>>(LOCAL_STORAGE_APPRECIATIONS_KEY, {})
  );

  const [savedMap, setSavedMap] = useState<Record<string, boolean>>(() =>
    getStorageItem<Record<string, boolean>>(LOCAL_STORAGE_SAVES_KEY, {})
  );

  const [loading, setLoading] = useState(true);

  // Sync state to localStorage
  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_PROJECTS_KEY, projects);
  }, [projects]);

  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_COMMENTS_KEY, comments);
  }, [comments]);

  useEffect(() => {
    if (currentUserId && !currentUserId.startsWith("guest-")) {
      setStorageItem(LOCAL_STORAGE_APPRECIATIONS_KEY, appreciatedMap);
    }
  }, [appreciatedMap, currentUserId]);

  useEffect(() => {
    if (currentUserId && !currentUserId.startsWith("guest-")) {
      setStorageItem(LOCAL_STORAGE_SAVES_KEY, savedMap);
    }
  }, [savedMap, currentUserId]);

  // Purge user-specific interaction maps on logout
  useEffect(() => {
    const resetUserState = () => {
      setAppreciatedMap({});
      setSavedMap({});
      setProjects((prev) =>
        prev.map((p) => ({
          ...p,
          isAppreciated: false,
          isSaved: false,
        }))
      );
    };

    if (!currentUserId || currentUserId.startsWith("guest-")) {
      resetUserState();
    }

    window.addEventListener("app-auth-logout", resetUserState);
    return () => window.removeEventListener("app-auth-logout", resetUserState);
  }, [currentUserId]);

  // Load live data from Supabase
  const refreshProjects = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Only show full loading skeleton on cold initial load when memory is empty
    setLoading((prev) => (projects.length === 0 ? true : false));
    try {
      // 1. Fetch in parallel: projects, comments, and (if logged in) user appreciations & saves
      const fetchPromises: any[] = [
        supabase
          .from("projects")
          .select(`
            *,
            creator:profiles(*)
          `)
          .order("created_at", { ascending: false }),
        supabase
          .from("comments")
          .select(`
            *,
            user:profiles(*)
          `)
          .order("created_at", { ascending: false }),
      ];

      const isAuthenticated = Boolean(currentUserId && !currentUserId.startsWith("guest-"));
      if (isAuthenticated) {
        fetchPromises.push(
          supabase.from("appreciations").select("project_id").eq("user_id", currentUserId)
        );
        fetchPromises.push(
          supabase.from("favorites").select("project_id").eq("user_id", currentUserId)
        );
      }

      const results = await Promise.all(fetchPromises);
      const { data: projectsData, error: projectsError } = results[0];
      const { data: commentsData } = results[1];
      const appData = isAuthenticated ? results[2]?.data : null;
      const favData = isAuthenticated ? results[3]?.data : null;

      const appMap: Record<string, boolean> = {};
      if (isAuthenticated && appData) {
        appData.forEach((a: any) => {
          appMap[a.project_id] = true;
        });
        setAppreciatedMap(appMap);
      } else if (!isAuthenticated) {
        setAppreciatedMap({});
      }

      const favMap: Record<string, boolean> = {};
      if (isAuthenticated && favData) {
        favData.forEach((f: any) => {
          favMap[f.project_id] = true;
        });
        setSavedMap(favMap);
      } else if (!isAuthenticated) {
        setSavedMap({});
      }

      if (!projectsError && projectsData) {
        const mapped: Project[] = projectsData.map((item: any) => ({
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
          contentBlocks: item.content_blocks || [],
          creator: item.creator
            ? {
                id: item.creator.id,
                username: item.creator.username,
                fullName: item.creator.full_name || item.creator.fullName || "Creative Member",
                headline: item.creator.headline || "Designer & Creator",
                bio: item.creator.bio || "",
                avatarUrl:
                  item.creator.avatar_url ||
                  item.creator.avatarUrl ||
                  `https://api.dicebear.com/7.x/shapes/svg?seed=${item.creator.username || "user"}`,
                bannerUrl: item.creator.banner_url || item.creator.bannerUrl,
                location: item.creator.location,
                website: item.creator.website,
                availableForWork: item.creator.available_for_work ?? true,
                skills: item.creator.skills || [],
              }
            : {
                id: item.user_id,
                username: "creator",
                fullName: "Creator",
                avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=creator",
              },
          userId: item.user_id,
          status: item.status || "published",
          isFeatured: item.is_featured || false,
          viewsCount: item.views_count || 0,
          appreciationsCount: item.appreciations_count || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          isAppreciated: isAuthenticated ? Boolean(appMap[item.id] ?? appreciatedMap[item.id]) : false,
          isSaved: isAuthenticated ? Boolean(favMap[item.id] ?? savedMap[item.id]) : false,
        }));

        setProjects(mapped);
      }

      if (commentsData) {
        const mappedComments: CommentItem[] = commentsData.map((c: any) => ({
          id: c.id,
          projectId: c.project_id,
          userId: c.user_id,
          content: c.content,
          createdAt: c.created_at,
          user: {
            id: c.user?.id || c.user_id,
            username: c.user?.username || "member",
            fullName: c.user?.full_name || "Creative Member",
            avatarUrl:
              c.user?.avatar_url ||
              `https://api.dicebear.com/7.x/shapes/svg?seed=${c.user?.username || "anon"}`,
          },
        }));
        setComments(mappedComments);
      }
    } catch (err) {
      console.warn("Supabase fetch error in useProjects:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Initial load
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // Filter projects dynamically
  const filteredProjects = projects.filter((project) => {
    if (!filters) return true;

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchDesc = project.description.toLowerCase().includes(q);
      const matchCreator =
        project.creator?.fullName?.toLowerCase().includes(q) ||
        project.creator?.username?.toLowerCase().includes(q);
      const matchTags = project.tags?.some((t) => t.toLowerCase().includes(q));
      const matchTools = project.tools?.some((t) => t.toLowerCase().includes(q));

      if (!matchTitle && !matchDesc && !matchCreator && !matchTags && !matchTools) {
        return false;
      }
    }

    // Category
    if (filters.category && filters.category !== "all") {
      if (!matchesCategory(project.category, project.categoryId, project.tags, filters.category)) {
        return false;
      }
    }

    // Sub-category
    if (filters.subCategory && filters.subCategory !== "all") {
      const subSlug = filters.subCategory.toLowerCase();
      const matchesSub =
        project.tags?.some((t) => t.toLowerCase().includes(subSlug)) ||
        project.title.toLowerCase().includes(subSlug) ||
        project.tools?.some((t) => t.toLowerCase().includes(subSlug));
      if (!matchesSub) return false;
    }

    // Tool
    if (filters.tool) {
      const toolName = filters.tool.toLowerCase();
      const matchesTool = project.tools?.some((t) => t.toLowerCase().includes(toolName));
      if (!matchesTool) return false;
    }

    return true;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!filters?.sortBy) return 0;
    switch (filters.sortBy as string) {
      case "newest":
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popular":
      case "appreciations":
      case "appreciated":
        return (b.appreciationsCount || 0) - (a.appreciationsCount || 0);
      case "views":
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      case "featured":
      default:
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Get single project by slug or ID
  const getProjectBySlug = useCallback(
    (slugOrId: string): Project | undefined => {
      const target = slugOrId.toLowerCase();
      return projects.find((p) => p.slug?.toLowerCase() === target || p.id === slugOrId);
    },
    [projects]
  );

  // Toggle Appreciation (Like)
  const toggleAppreciation = useCallback(
    async (projectId: string, userId?: string) => {
      if (!userId || userId.startsWith("guest-")) {
        return;
      }

      const isCurrentlyAppreciated = Boolean(appreciatedMap[projectId]);
      const nextState = !isCurrentlyAppreciated;

      // Optimistic update
      setAppreciatedMap((prev) => ({ ...prev, [projectId]: nextState }));
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                isAppreciated: nextState,
                appreciationsCount: Math.max(
                  0,
                  (p.appreciationsCount || 0) + (nextState ? 1 : -1)
                ),
              }
            : p
        )
      );

      // Sync with Supabase
      if (isSupabaseConfigured) {
        try {
          if (nextState) {
            await supabase.from("appreciations").upsert({
              user_id: userId,
              project_id: projectId,
            });
          } else {
            await supabase
              .from("appreciations")
              .delete()
              .match({ user_id: userId, project_id: projectId });
          }

          // Keep appreciations_count column in sync on projects table
          const { count } = await supabase
            .from("appreciations")
            .select("id", { count: "exact", head: true })
            .eq("project_id", projectId);

          if (typeof count === "number") {
            await supabase
              .from("projects")
              .update({ appreciations_count: count })
              .eq("id", projectId);
          }
        } catch (err) {
          console.warn("Supabase appreciation error:", err);
        }
      }
    },
    [appreciatedMap]
  );

  // Toggle Save (Favorites / Moodboard)
  const toggleSave = useCallback(
    async (projectId: string, userId?: string) => {
      if (!userId || userId.startsWith("guest-")) {
        return;
      }

      const isCurrentlySaved = Boolean(savedMap[projectId]);
      const nextState = !isCurrentlySaved;

      // Optimistic update
      setSavedMap((prev) => ({ ...prev, [projectId]: nextState }));
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, isSaved: nextState } : p))
      );

      // Sync with Supabase favorites table
      if (isSupabaseConfigured) {
        try {
          if (nextState) {
            await supabase.from("favorites").upsert({
              user_id: userId,
              project_id: projectId,
            });
          } else {
            await supabase
              .from("favorites")
              .delete()
              .match({ user_id: userId, project_id: projectId });
          }
        } catch (err) {
          console.warn("Supabase favorites sync error:", err);
        }
      }
    },
    [savedMap]
  );

  // Increment project views
  const incrementViews = useCallback(async (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p
      )
    );

    if (isSupabaseConfigured) {
      try {
        await supabase.rpc("increment_project_views", { p_id: projectId });
      } catch {
        // Fallback standard update
        const { data } = await supabase.from("projects").select("views_count").eq("id", projectId).single();
        if (data) {
          await supabase.from("projects").update({ views_count: (data.views_count || 0) + 1 }).eq("id", projectId);
        }
      }
    }
  }, []);

  // Comments for a specific project
  const getProjectComments = useCallback(
    (projectId: string): CommentItem[] => {
      return comments.filter((c) => c.projectId === projectId);
    },
    [comments]
  );

  // Add Comment
  const addComment = useCallback(
    async (
      projectId: string,
      user: { id: string; fullName: string; username: string; avatarUrl?: string },
      content: string
    ) => {
      const newCommentId = `comment-${Date.now()}`;
      const newComment: CommentItem = {
        id: newCommentId,
        projectId,
        userId: user.id,
        content,
        createdAt: new Date().toISOString(),
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
      };

      setComments((prev) => [newComment, ...prev]);

      if (isSupabaseConfigured && !user.id.startsWith("guest-")) {
        try {
          await supabase.from("comments").insert({
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
  const deleteComment = useCallback(async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    if (isSupabaseConfigured) {
      try {
        await supabase.from("comments").delete().eq("id", commentId);
      } catch (err) {
        console.warn("Supabase delete comment error:", err);
      }
    }
  }, []);

  // Create or Update Project in Supabase
  const saveProject = useCallback(
    async (projectData: Partial<Project>, currentUser?: Profile | null): Promise<Project> => {
      const id = projectData.id || `proj-${Date.now()}`;
      const slug =
        projectData.slug ||
        projectData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
        id;

      const creator = currentUser
        ? {
            id: currentUser.id,
            username: currentUser.username,
            fullName: currentUser.fullName,
            avatarUrl: currentUser.avatarUrl,
            headline: currentUser.headline,
            bio: currentUser.bio,
            location: currentUser.location,
            website: currentUser.website,
            skills: currentUser.skills,
          }
        : {
            id: projectData.userId || "creator",
            username: "creator",
            fullName: "Creative Member",
            avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=creator",
          };

      const finalProject: Project = {
        id,
        slug,
        title: projectData.title || "Untitled Case Study",
        description: projectData.description || "",
        fullDescription: projectData.fullDescription || "",
        category: projectData.category || "UI/UX & Product Design",
        categoryId: projectData.categoryId || "ui-ux",
        coverImage:
          projectData.coverImage ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        accentColor: projectData.accentColor || "#CDF22B",
        year: projectData.year || new Date().getFullYear().toString(),
        tools: projectData.tools || [],
        tags: projectData.tags || [],
        images: projectData.images || [],
        contentBlocks: projectData.contentBlocks || [],
        creator,
        userId: currentUser?.id || projectData.userId || "creator",
        status: projectData.status || "published",
        isFeatured: projectData.isFeatured || false,
        viewsCount: projectData.viewsCount || 0,
        appreciationsCount: projectData.appreciationsCount || 0,
        createdAt: projectData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Local state update
      setProjects((prev) => {
        const index = prev.findIndex((p) => p.id === id || p.slug === slug);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = finalProject;
          return updated;
        }
        return [finalProject, ...prev];
      });

      // Supabase persistence
      if (isSupabaseConfigured && currentUser?.id && !currentUser.id.startsWith("guest-")) {
        try {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
          const payload: any = {
            user_id: currentUser.id,
            title: finalProject.title,
            slug: finalProject.slug,
            description: finalProject.description,
            full_description: finalProject.fullDescription,
            category: finalProject.category,
            category_id: finalProject.categoryId,
            cover_image: finalProject.coverImage,
            accent_color: finalProject.accentColor,
            year: finalProject.year,
            tools: finalProject.tools,
            tags: finalProject.tags,
            images: finalProject.images,
            content_blocks: finalProject.contentBlocks,
            status: finalProject.status,
            is_featured: finalProject.isFeatured,
            updated_at: new Date().toISOString(),
          };

          if (isUuid) {
            payload.id = id;
          }

          const { data: savedDbRow, error } = await supabase
            .from("projects")
            .upsert(payload)
            .select("*, creator:profiles(*)")
            .single();

          if (!error && savedDbRow) {
            finalProject.id = savedDbRow.id;
            finalProject.slug = savedDbRow.slug || savedDbRow.id;
            // Update local state with real DB row
            setProjects((prev) =>
              prev.map((p) => (p.id === id || p.slug === slug ? finalProject : p))
            );
          }
        } catch (err) {
          console.warn("Supabase save project error:", err);
        }
      }

      return finalProject;
    },
    []
  );

  // Delete Project
  const deleteProject = useCallback(async (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (isSupabaseConfigured) {
      try {
        await supabase.from("projects").delete().eq("id", projectId);
      } catch (err) {
        console.warn("Supabase delete project error:", err);
      }
    }
  }, []);

  const isAuthenticated = Boolean(currentUserId && !currentUserId.startsWith("guest-"));
  const favoritesCount = isAuthenticated
    ? sortedProjects.filter((p) => Boolean(p.isAppreciated)).length
    : 0;
  const savedCount = isAuthenticated
    ? sortedProjects.filter((p) => Boolean(p.isSaved)).length
    : 0;

  return {
    projects: sortedProjects,
    allProjects: projects,
    favoritesCount,
    savedCount,
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

