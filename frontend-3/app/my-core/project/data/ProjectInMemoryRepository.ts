import { ProjectRepository } from "../domain/ProjectRepository";
import {
  ProjectEntity,
  CreateProjectData,
  UpdateProjectData,
} from "../domain/Project";
import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";

export class ProjectInMemoryRepository implements ProjectRepository {
  private projects: ProjectEntity[] = [];

  async getAll(userId: number): Promise<Either<DataError, ProjectEntity[]>> {
    try {
      const userProjects = this.projects.filter(
        (project) => project.user_id === userId
      );
      return Either.right(userProjects);
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
      const project = this.projects.find(
        (p) => p.id === id && p.user_id === userId
      );

      if (!project) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Project not found"),
        });
      }

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
      const newId = Math.max(0, ...this.projects.map((p) => p.id)) + 1;
      const project = ProjectEntity.create(data, userId);
      const projectWithId = new ProjectEntity({
        ...project.toJSON(),
        id: newId,
      });

      this.projects.push(projectWithId);
      return Either.right(projectWithId);
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
      const index = this.projects.findIndex(
        (p) => p.id === id && p.user_id === userId
      );

      if (index === -1) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Project not found"),
        });
      }

      const updatedProject = this.projects[index].update(data);
      this.projects[index] = updatedProject;

      return Either.right(updatedProject);
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
      const index = this.projects.findIndex(
        (p) => p.id === id && p.user_id === userId
      );

      if (index === -1) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Project not found"),
        });
      }

      this.projects.splice(index, 1);
      return Either.right(true);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }
}
