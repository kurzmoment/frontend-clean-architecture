import { apiClient } from "../api/api-client";
import type { ProjectRepository } from "../../domain/repositories/project-repository";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../shared-kernel";

export function createProjectRepository(request: Request): ProjectRepository {
  return {
    async getAll(): Promise<Project[]> {
      console.log("Server Repository: Getting all projects");
      const response = await apiClient.get<Project[]>("/projects", request);
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      return response.data;
    },

    async getById(id: number): Promise<Project> {
      console.log(`Server Repository: Getting project ${id}`);
      const response = await apiClient.get<Project>(`/projects/${id}`, request);
      if (!response.ok) {
        throw new Error("Project not found");
      }
      return response.data;
    },

    async create(
      project: CreateProjectRequest
    ): Promise<{ message: string; project: Project }> {
      console.log("Server Repository: Creating project with data:", project);
      const response = await apiClient.post<{
        message: string;
        project: Project;
      }>("/projects", project, request);
      console.log("Server Repository: API response status:", response.ok);
      console.log("Server Repository: API response data:", response.data);
      if (!response.ok) {
        console.error(
          "Server Repository: API error status:",
          response.status,
          response.statusText
        );
        console.error("Server Repository: API error data:", response.data);
        throw new Error("Failed to create project");
      }
      return response.data;
    },

    async update(
      id: number,
      project: UpdateProjectRequest
    ): Promise<{ message: string }> {
      console.log(
        `Server Repository: Updating project ${id} with data:`,
        project
      );
      const response = await apiClient.put<{ message: string }>(
        `/projects/${id}`,
        project,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
      return response.data;
    },

    async delete(id: number): Promise<{ message: string }> {
      console.log(`Server Repository: Deleting project ${id}`);
      const response = await apiClient.delete<{ message: string }>(
        `/projects/${id}`,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return response.data;
    },

    async addConfident(
      projectId: number,
      confidentId: number
    ): Promise<{ message: string }> {
      console.log(
        `Server Repository: Adding confident ${confidentId} to project ${projectId}`
      );
      const response = await apiClient.post<{ message: string }>(
        `/projects/${projectId}/confidents`,
        { confident_id: confidentId },
        request
      );
      if (!response.ok) {
        throw new Error("Failed to add confident to project");
      }
      return response.data;
    },

    async removeConfident(
      projectId: number,
      confidentId: number
    ): Promise<{ message: string }> {
      console.log(
        `Server Repository: Removing confident ${confidentId} from project ${projectId}`
      );
      const response = await apiClient.delete<{ message: string }>(
        `/projects/${projectId}/confidents/${confidentId}`,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to remove confident from project");
      }
      return response.data;
    },

    async addTag(
      projectId: number,
      tagId: number
    ): Promise<{ message: string }> {
      console.log(
        `Server Repository: Adding tag ${tagId} to project ${projectId}`
      );
      const response = await apiClient.post<{ message: string }>(
        `/projects/${projectId}/tags`,
        { tag_id: tagId },
        request
      );
      if (!response.ok) {
        throw new Error("Failed to add tag to project");
      }
      return response.data;
    },

    async removeTag(
      projectId: number,
      tagId: number
    ): Promise<{ message: string }> {
      console.log(
        `Server Repository: Removing tag ${tagId} from project ${projectId}`
      );
      const response = await apiClient.delete<{ message: string }>(
        `/projects/${projectId}/tags/${tagId}`,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to remove tag from project");
      }
      return response.data;
    },
  };
}
