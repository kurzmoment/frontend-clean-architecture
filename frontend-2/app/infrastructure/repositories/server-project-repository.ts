import { apiClient } from "../api/api-client";
import type { ProjectRepository } from "../../domain/repositories/project-repository";
import type { ConfidentRepository } from "../../domain/repositories/confident-repository";
import type { TagRepository } from "../../domain/repositories/tag-repository";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";

// Factory function to create a server-side project repository
export function createServerProjectRepository(
  request: Request
): ProjectRepository {
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

// Factory function to create a server-side confident repository
export function createServerConfidentRepository(
  request: Request
): ConfidentRepository {
  return {
    async getAll(): Promise<Confident[]> {
      console.log("Server Repository: Getting all confidents");
      const response = await apiClient.get<Confident[]>("/confidents", request);
      if (!response.ok) {
        throw new Error("Failed to fetch confidents");
      }
      return response.data;
    },

    async getById(id: number): Promise<Confident> {
      console.log(`Server Repository: Getting confident ${id}`);
      const response = await apiClient.get<Confident>(
        `/confidents/${id}`,
        request
      );
      if (!response.ok) {
        throw new Error("Confident not found");
      }
      return response.data;
    },

    async create(
      confident: CreateConfidentRequest
    ): Promise<{ message: string; confident: Confident }> {
      console.log(
        "Server Repository: Creating confident with data:",
        confident
      );
      const response = await apiClient.post<{
        message: string;
        confident: Confident;
      }>("/confidents", confident, request);
      if (!response.ok) {
        throw new Error("Failed to create confident");
      }
      return response.data;
    },

    async update(
      id: number,
      confident: UpdateConfidentRequest
    ): Promise<{ message: string }> {
      console.log(
        `Server Repository: Updating confident ${id} with data:`,
        confident
      );
      const response = await apiClient.put<{ message: string }>(
        `/confidents/${id}`,
        confident,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to update confident");
      }
      return response.data;
    },

    async delete(id: number): Promise<{ message: string }> {
      console.log(`Server Repository: Deleting confident ${id}`);
      const response = await apiClient.delete<{ message: string }>(
        `/confidents/${id}`,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to delete confident");
      }
      return response.data;
    },
  };
}

// Factory function to create a server-side tag repository
export function createServerTagRepository(request: Request): TagRepository {
  return {
    async getAll(): Promise<Tag[]> {
      console.log("Server Repository: Getting all tags");
      const response = await apiClient.get<Tag[]>("/tags", request);
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      return response.data;
    },

    async getById(id: number): Promise<Tag> {
      console.log(`Server Repository: Getting tag ${id}`);
      const response = await apiClient.get<Tag>(`/tags/${id}`, request);
      if (!response.ok) {
        throw new Error("Tag not found");
      }
      return response.data;
    },

    async create(
      tag: CreateTagRequest
    ): Promise<{ message: string; tag: Tag }> {
      console.log("Server Repository: Creating tag with data:", tag);
      const response = await apiClient.post<{ message: string; tag: Tag }>(
        "/tags",
        tag,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to create tag");
      }
      return response.data;
    },

    async update(
      id: number,
      tag: UpdateTagRequest
    ): Promise<{ message: string }> {
      console.log(`Server Repository: Updating tag ${id} with data:`, tag);
      const response = await apiClient.put<{ message: string }>(
        `/tags/${id}`,
        tag,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to update tag");
      }
      return response.data;
    },

    async delete(id: number): Promise<{ message: string }> {
      console.log(`Server Repository: Deleting tag ${id}`);
      const response = await apiClient.delete<{ message: string }>(
        `/tags/${id}`,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }
      return response.data;
    },
  };
}
