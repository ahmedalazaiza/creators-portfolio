import { useState, useEffect, useCallback } from "react";
import { Collection, Project } from "../types";
import { useProjects } from "./useProjects";
import { useAuth } from "../context/AuthContext";

const LOCAL_STORAGE_COLLECTIONS_KEY = "azaiza_gallery_collections_v3";

const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    userId: "ahmed-azaiza",
    title: "Spatial & Modern UI Systems",
    description: "Cutting-edge design systems and spatial augmented reality interfaces.",
    projectIds: ["proj-1", "proj-4", "proj-7"],
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-15T14:30:00Z",
  },
  {
    id: "col-2",
    userId: "ahmed-azaiza",
    title: "3D CGI & Abstract Motion",
    description: "Futuristic synthetic renders, octane materials, and particle simulations.",
    projectIds: ["proj-2", "proj-5", "proj-8"],
    coverImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2025-01-12T11:20:00Z",
    updatedAt: "2025-01-18T09:15:00Z",
  },
  {
    id: "col-3",
    userId: "ahmed-azaiza",
    title: "Architectural & Monolith Lighting",
    description: "Minimalist brutalism and atmospheric spatial photography.",
    projectIds: ["proj-3", "proj-6"],
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2025-01-14T16:45:00Z",
    updatedAt: "2025-01-20T12:00:00Z",
  },
];

export function useCollections() {
  const { allProjects } = useProjects();
  const { user } = useAuth();

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_COLLECTIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return DEFAULT_COLLECTIONS;
      }
    }
    return DEFAULT_COLLECTIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_COLLECTIONS_KEY, JSON.stringify(collections));
  }, [collections]);

  const createCollection = useCallback(
    (title: string, description?: string): Collection => {
      const newCol: Collection = {
        id: `col-${Date.now()}`,
        userId: user?.id || "ahmed-azaiza",
        title: title.trim(),
        description: description?.trim() || "",
        projectIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCollections((prev) => [newCol, ...prev]);
      return newCol;
    },
    [user]
  );

  const deleteCollection = useCallback((collectionId: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
  }, []);

  const toggleProjectInCollection = useCallback(
    (collectionId: string, projectId: string) => {
      setCollections((prev) =>
        prev.map((col) => {
          if (col.id === collectionId) {
            const hasProject = col.projectIds.includes(projectId);
            const nextIds = hasProject
              ? col.projectIds.filter((id) => id !== projectId)
              : [...col.projectIds, projectId];

            // Update cover image to the latest added project if available
            const latestProject = allProjects.find((p) => p.id === projectId);
            const coverImage =
              !hasProject && latestProject
                ? latestProject.coverImage
                : col.coverImage || (allProjects.find((p) => nextIds.includes(p.id))?.coverImage);

            return {
              ...col,
              projectIds: nextIds,
              coverImage,
              updatedAt: new Date().toISOString(),
            };
          }
          return col;
        })
      );
    },
    [allProjects]
  );

  const isProjectInCollection = useCallback(
    (collectionId: string, projectId: string): boolean => {
      const col = collections.find((c) => c.id === collectionId);
      return Boolean(col?.projectIds.includes(projectId));
    },
    [collections]
  );

  const getCollectionProjects = useCallback(
    (collectionId: string): Project[] => {
      const col = collections.find((c) => c.id === collectionId);
      if (!col) return [];
      return allProjects.filter((p) => col.projectIds.includes(p.id) || col.projectIds.includes(p.slug));
    },
    [collections, allProjects]
  );

  return {
    collections,
    createCollection,
    deleteCollection,
    toggleProjectInCollection,
    isProjectInCollection,
    getCollectionProjects,
  };
}
