import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/api-client";
import type { Project, Confident, Tag } from "../../shared-kernel";

// Query keys
export const queryKeys = {
  projects: ["projects"] as const,
  confidents: ["confidents"] as const,
  tags: ["tags"] as const,
  project: (id: number) => ["project", id] as const,
  confident: (id: number) => ["confident", id] as const,
  tag: (id: number) => ["tag", id] as const,
};

// Client-side query functions (for useQuery hooks)
const clientQueryFunctions = {
  projects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects");
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return response.data;
  },

  confidents: async (): Promise<Confident[]> => {
    const response = await apiClient.get<Confident[]>("/confidents");
    if (!response.ok) {
      throw new Error("Failed to fetch confidents");
    }
    return response.data;
  },

  tags: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>("/tags");
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    return response.data;
  },
};

// Server-side query functions (for loaders)
export const serverQueryFunctions = {
  projects: async (request: Request): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects", request);
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return response.data;
  },

  confidents: async (request: Request): Promise<Confident[]> => {
    const response = await apiClient.get<Confident[]>("/confidents", request);
    if (!response.ok) {
      throw new Error("Failed to fetch confidents");
    }
    return response.data;
  },

  tags: async (request: Request): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>("/tags", request);
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    return response.data;
  },
};

// Query hooks
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: clientQueryFunctions.projects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useConfidents() {
  return useQuery({
    queryKey: queryKeys.confidents,
    queryFn: clientQueryFunctions.confidents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: clientQueryFunctions.tags,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
