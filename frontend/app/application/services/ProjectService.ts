import type { ProjectRepository } from "../../infrastructure/repositories/ProjectRepository";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../domain/entities/Project";
import { ProjectEntity } from "../../domain/entities/Project";

export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  async getAllProjects(): Promise<ProjectEntity[]> {
    try {
      const projects = await this.projectRepository.getAll();
      return projects.map((project) => ProjectEntity.create(project));
    } catch (error) {
      throw new Error("Failed to fetch projects");
    }
  }

  async getProjectById(id: number): Promise<ProjectEntity> {
    try {
      const project = await this.projectRepository.getById(id);
      return ProjectEntity.create(project);
    } catch (error) {
      throw new Error("Project not found");
    }
  }

  async createProject(
    projectData: CreateProjectRequest
  ): Promise<ProjectEntity> {
    try {
      const response = await this.projectRepository.create(projectData);
      return ProjectEntity.create(response.project);
    } catch (error) {
      throw new Error("Failed to create project");
    }
  }

  async updateProject(
    id: number,
    projectData: UpdateProjectRequest
  ): Promise<void> {
    try {
      await this.projectRepository.update(id, projectData);
    } catch (error) {
      throw new Error("Failed to update project");
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await this.projectRepository.delete(id);
    } catch (error) {
      throw new Error("Failed to delete project");
    }
  }

  async addConfidentToProject(
    projectId: number,
    confidentId: number
  ): Promise<void> {
    try {
      await this.projectRepository.addConfident(projectId, confidentId);
    } catch (error) {
      throw new Error("Failed to add confident to project");
    }
  }

  async removeConfidentFromProject(
    projectId: number,
    confidentId: number
  ): Promise<void> {
    try {
      await this.projectRepository.removeConfident(projectId, confidentId);
    } catch (error) {
      throw new Error("Failed to remove confident from project");
    }
  }

  async addTagToProject(projectId: number, tagId: number): Promise<void> {
    try {
      await this.projectRepository.addTag(projectId, tagId);
    } catch (error) {
      throw new Error("Failed to add tag to project");
    }
  }

  async removeTagFromProject(projectId: number, tagId: number): Promise<void> {
    try {
      await this.projectRepository.removeTag(projectId, tagId);
    } catch (error) {
      throw new Error("Failed to remove tag from project");
    }
  }
}
