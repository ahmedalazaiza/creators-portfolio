import { useMemo } from "react";
import { Project, Profile } from "../types";
import { useProjects } from "./useProjects";
import { useCreator } from "./useCreator";

export function useRecommendations() {
  const { allProjects } = useProjects();
  const { creatorsList } = useCreator();

  // Extract user taste profile from appreciated and saved projects
  const appreciated = allProjects.filter((p) => p.isAppreciated);
  const saved = allProjects.filter((p) => p.isSaved);

  const favoriteCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    [...appreciated, ...saved].forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }, [appreciated, saved]);

  const favoriteTools = useMemo(() => {
    const counts: Record<string, number> = {};
    [...appreciated, ...saved].forEach((p) => {
      (p.tools || []).forEach((tool) => {
        counts[tool] = (counts[tool] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tool]) => tool);
  }, [appreciated, saved]);

  // Recommended Projects
  const recommendedProjects = useMemo(() => {
    return [...allProjects]
      .filter((p) => p.status !== "draft")
      .map((p) => {
        let score = 0;
        if (p.isFeatured) score += 3;
        if (favoriteCategories.includes(p.category)) score += 5;
        if (p.tools?.some((t) => favoriteTools.includes(t))) score += 4;
        score += Math.min((p.appreciationsCount || 0) / 50, 5);
        return { project: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.project);
  }, [allProjects, favoriteCategories, favoriteTools]);

  // Calculate Similar Projects for a given project
  const getSimilarProjects = (targetProject: Project, limit = 3): Project[] => {
    return allProjects
      .filter((p) => p.id !== targetProject.id && p.status !== "draft")
      .map((p) => {
        let similarity = 0;
        if (p.category === targetProject.category) similarity += 5;
        if (p.categoryId === targetProject.categoryId) similarity += 5;

        // Shared tools
        const sharedTools = (p.tools || []).filter((t) =>
          (targetProject.tools || []).includes(t)
        );
        similarity += sharedTools.length * 3;

        // Shared tags
        const sharedTags = (p.tags || []).filter((t) =>
          (targetProject.tags || []).includes(t)
        );
        similarity += sharedTags.length * 2;

        return { project: p, similarity };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map((item) => item.project);
  };

  // Recommended Creators
  const recommendedCreators = useMemo(() => {
    return (creatorsList || [])
      .filter((c) => !c.isFollowing)
      .map((c) => {
        let score = (c.followersCount || 0) + (c.totalAppreciations || 0) / 10;
        if (c.availableForWork) score += 20;
        return { creator: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.creator);
  }, [creatorsList]);

  return {
    recommendedProjects,
    getSimilarProjects,
    recommendedCreators,
    favoriteCategories,
  };
}
