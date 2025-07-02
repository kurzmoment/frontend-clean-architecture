import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/api-client";
import { queryKeys } from "../shared/query-keys";
import type { Project } from "../shared/types";
import {
  serverGetAllProjects,
  serverGetProjectById,
} from "../../../application/use-cases/projects";
import { createProjectRepository } from "@/infrastructure/repositories/project-repository-impl";

// Client-side query functions
const clientQueryFunctions = {
  projects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects");
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return response.data;
  },

  project: async (id: number): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }
    return response.data;
  },
};

// Server-side query functions
export const projectServerQueryFunctions = {
  projects: async (request: Request): Promise<Project[]> => {
    console.log("--------------------------------");
    console.log("SERVER QUERY FUNCTIONS - PROJECTS");
    console.log("--------------------------------");
    console.log("Loading projects via serverQueryFunctions...");

    const projectRepository = createProjectRepository(request);
    const projects = await serverGetAllProjects(projectRepository);

    console.log(`Retrieved ${projects.length} projects via use case`);
    return projects;
  },

  project: async (request: Request, id: number): Promise<Project> => {
    console.log("--------------------------------");
    console.log("SERVER QUERY FUNCTIONS - PROJECT BY ID");
    console.log("--------------------------------");
    console.log(`Loading project ${id} via serverQueryFunctions...`);

    const projectRepository = createProjectRepository(request);
    const project = await serverGetProjectById(id, projectRepository);

    console.log("Retrieved project via use case:", project);
    return project;
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

export function useProject(id: number) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => clientQueryFunctions.project(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}
