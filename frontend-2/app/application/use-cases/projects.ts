import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../shared-kernel";
import type { ProjectRepository } from "../../domain/repositories/project-repository";
import type { NotificationService } from "../services/notification-service";
import { createProject, isProjectValid } from "../../domain/model/project";

export async function getAllProjects(
  projectRepository: ProjectRepository,
  notifier: NotificationService
): Promise<Project[]> {
  try {
    const projects = await projectRepository.getAll();
    return projects;
  } catch (error) {
    notifier.error("Failed to fetch projects");
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectById(
  id: number,
  projectRepository: ProjectRepository,
  notifier: NotificationService
): Promise<Project> {
  try {
    const project = await projectRepository.getById(id);
    return project;
  } catch (error) {
    notifier.error("Project not found");
    throw new Error("Project not found");
  }
}

export async function createNewProject(
  projectData: CreateProjectRequest,
  userId: number,
  projectRepository: ProjectRepository,
  notifier: NotificationService
): Promise<Project> {
  try {
    console.log("Creating project with data:", projectData);
    console.log("User ID:", userId);

    // Validate the input data using the schema
    const { validateCreateProject } = await import(
      "../../domain/model/project"
    );
    validateCreateProject(projectData);

    const response = await projectRepository.create(projectData);
    console.log("Project created successfully:", response);
    notifier.success("Project created successfully!");

    return response.project;
  } catch (error) {
    console.error("Error in createNewProject:", error);
    notifier.error("Failed to create project");
    throw new Error("Failed to create project");
  }
}

export async function updateExistingProject(
  id: number,
  projectData: UpdateProjectRequest,
  projectRepository: ProjectRepository,
  notifier: NotificationService
): Promise<void> {
  try {
    await projectRepository.update(id, projectData);
    notifier.success("Project updated successfully!");
  } catch (error) {
    notifier.error("Failed to update project");
    throw new Error("Failed to update project");
  }
}

export async function deleteExistingProject(
  id: number,
  projectRepository: ProjectRepository,
  notifier: NotificationService
): Promise<void> {
  try {
    await projectRepository.delete(id);
    notifier.success("Project deleted successfully!");
  } catch (error) {
    notifier.error("Failed to delete project");
    throw new Error("Failed to delete project");
  }
}

export async function addConfidentToProject(
  projectId: number,
  confidentId: number,
  projectRepository: ProjectRepository,
  notifier: NotificationService
): Promise<void> {
  try {
    await projectRepository.addConfident(projectId, confidentId);
    notifier.success("Confident added to project!");
  } catch (error) {
    notifier.error("Failed to add confident to project");
    throw new Error("Failed to add confident to project");
  }
}

export async function addTagToProject(
  projectId: number,
  tagId: number,
  projectRepository: ProjectRepository,
  notifier: NotificationService
): Promise<void> {
  try {
    await projectRepository.addTag(projectId, tagId);
    notifier.success("Tag added to project!");
  } catch (error) {
    notifier.error("Failed to add tag to project");
    throw new Error("Failed to add tag to project");
  }
}
