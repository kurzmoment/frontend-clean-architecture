import { ProjectRepository } from "../domain/ProjectRepository";
import {
  ProjectEntity,
  CreateProjectData,
  UpdateProjectData,
} from "../domain/Project";
import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";
import { apiClient } from "../../../infrastructure/api/api-client";
import { ConfidentEntity } from "../../confident/domain/Confident";
import { TagEntity } from "../../tag/domain/Tag";

export class ProjectDatabaseRepository implements ProjectRepository {
  async getAll(userId: number): Promise<Either<DataError, ProjectEntity[]>> {
    try {
      const response = await apiClient.get<any[]>("/projects");

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to fetch projects"),
        });
      }

      const projects = response.data.map((project) => {
        // Transform the API response to match our domain model
        const transformedProject = {
          ...project,
          confidents: project.confidents || [],
          tags: project.tags || [],
        };
        return ProjectEntity.fromJSON(transformedProject);
      });

      return Either.right(projects);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async getById(
    id: number,
    userId: number
  ): Promise<Either<DataError, ProjectEntity>> {
    try {
      const response = await apiClient.get<any>(`/projects/${id}`);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to fetch project"),
        });
      }

      // Transform the API response to match our domain model
      const transformedProject = {
        ...response.data,
        confidents: response.data.confidents || [],
        tags: response.data.tags || [],
      };

      const project = ProjectEntity.fromJSON(transformedProject);
      return Either.right(project);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async create(
    data: CreateProjectData,
    userId: number
  ): Promise<Either<DataError, ProjectEntity>> {
    try {
      const response = await apiClient.post<any>("/projects", data);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to create project"),
        });
      }

      const project = ProjectEntity.fromJSON(response.data.project);
      return Either.right(project);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async update(
    id: number,
    data: UpdateProjectData,
    userId: number
  ): Promise<Either<DataError, ProjectEntity>> {
    try {
      const response = await apiClient.put<any>(`/projects/${id}`, data);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to update project"),
        });
      }

      // Since the API doesn't return the updated project, we need to fetch it
      return this.getById(id, userId);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async delete(
    id: number,
    userId: number
  ): Promise<Either<DataError, boolean>> {
    try {
      const response = await apiClient.delete<any>(`/projects/${id}`);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to delete project"),
        });
      }

      return Either.right(true);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }
}
