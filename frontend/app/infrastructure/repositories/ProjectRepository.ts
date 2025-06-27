import { apiClient } from "../api/client";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../domain/entities/Project";

export interface ProjectRepository {
  getAll(): Promise<Project[]>;
  getById(id: number): Promise<Project>;
  create(
    project: CreateProjectRequest
  ): Promise<{ message: string; project: Project }>;
  update(
    id: number,
    project: UpdateProjectRequest
  ): Promise<{ message: string }>;
  delete(id: number): Promise<{ message: string }>;
  addConfident(
    projectId: number,
    confidentId: number
  ): Promise<{ message: string }>;
  removeConfident(
    projectId: number,
    confidentId: number
  ): Promise<{ message: string }>;
  addTag(projectId: number, tagId: number): Promise<{ message: string }>;
  removeTag(projectId: number, tagId: number): Promise<{ message: string }>;
}

export class ProjectRepositoryImpl implements ProjectRepository {
  async getAll(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>("/projects");
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return response.data;
  }

  async getById(id: number): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    if (!response.ok) {
      throw new Error("Project not found");
    }
    return response.data;
  }

  async create(
    project: CreateProjectRequest
  ): Promise<{ message: string; project: Project }> {
    const response = await apiClient.post<{
      message: string;
      project: Project;
    }>("/projects", project);
    if (!response.ok) {
      throw new Error("Failed to create project");
    }
    return response.data;
  }

  async update(
    id: number,
    project: UpdateProjectRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      `/projects/${id}`,
      project
    );
    if (!response.ok) {
      throw new Error("Failed to update project");
    }
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/projects/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to delete project");
    }
    return response.data;
  }

  async addConfident(
    projectId: number,
    confidentId: number
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `/projects/${projectId}/confidents`,
      { confident_id: confidentId }
    );
    if (!response.ok) {
      throw new Error("Failed to add confident to project");
    }
    return response.data;
  }

  async removeConfident(
    projectId: number,
    confidentId: number
  ): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/projects/${projectId}/confidents/${confidentId}`
    );
    if (!response.ok) {
      throw new Error("Failed to remove confident from project");
    }
    return response.data;
  }

  async addTag(projectId: number, tagId: number): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `/projects/${projectId}/tags`,
      { tag_id: tagId }
    );
    if (!response.ok) {
      throw new Error("Failed to add tag to project");
    }
    return response.data;
  }

  async removeTag(
    projectId: number,
    tagId: number
  ): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/projects/${projectId}/tags/${tagId}`
    );
    if (!response.ok) {
      throw new Error("Failed to remove tag from project");
    }
    return response.data;
  }
}
