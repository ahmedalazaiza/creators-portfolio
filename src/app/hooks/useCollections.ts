import { useState, useEffect, useCallback } from "react";
import { Collection, Project } from "../types";
import { useProjects } from "./useProjects";
import { useAuth } from "../context/AuthContext";
import { getStorageItem, setStorageItem } from "../../lib/storage";

const LOCAL_STORAGE_COLLECTIONS_KEY = "azaiza_gallery_collections_v3";

const DEFAULT_COLLECTIONS: Collection[] = [];

export function useCollections() {
  const { allProjects } = useProjects();
  const { user } = useAuth();

  const [collections, setCollections] = useState<Collection[]>(() =>
    getStorageItem<Collection[]>(LOCAL_STORAGE_COLLECTIONS_KEY, DEFAULT_COLLECTIONS)
  );

  // Sync to localStorage
  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_COLLECTIONS_KEY, collections);
  }, [collections]);
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
