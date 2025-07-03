import { useQuery } from "@tanstack/react-query";
import { projectsService } from "../../../services";
import { queryKeys } from "../shared/query-keys";
import type { Project } from "../../../services";

// Unified query functions
export const projectQueryFunctions = {
  projects: async (serverRequest?: Request): Promise<Project[]> => {
    const result = await projectsService.getAll(serverRequest);
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch projects");
    }
    return result.data || [];
  },

  project: async (id: number, serverRequest?: Request): Promise<Project> => {
    const result = await projectsService.getById(id, serverRequest);
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch project");
    }
    return result.data!;
  },
};

// Query hooks
export function useProjects(initialData?: Project[]) {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => projectQueryFunctions.projects(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData,
  });
}

export function useProjectsServer(request: Request, initialData?: Project[]) {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => projectQueryFunctions.projects(request),
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData,
  });
}

export function useProject(id: number, initialData?: Project) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => projectQueryFunctions.project(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    initialData,
  });
}

export function useProjectServer(
  id: number,
  request: Request,
  initialData?: Project
) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => projectQueryFunctions.project(id, request),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    initialData,
  });
}
