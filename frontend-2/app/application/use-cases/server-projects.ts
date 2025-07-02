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
import type { ProjectRepository } from "../../domain/repositories/project-repository";
import type { ConfidentRepository } from "../../domain/repositories/confident-repository";
import type { TagRepository } from "../../domain/repositories/tag-repository";
import type { NotificationService } from "../services/notification-service";
import { createProject, isProjectValid } from "../../domain/model/project";
import {
  createConfident,
  isConfidentValid,
} from "../../domain/model/confident";
import { createTag, isTagValid } from "../../domain/model/tag";

// Server-side notification service that logs instead of showing UI notifications
class ServerNotificationService implements NotificationService {
  success(message: string): void {
    console.log("✅ SUCCESS:", message);
  }

  error(message: string): void {
    console.error("❌ ERROR:", message);
  }

  warning(message: string): void {
    console.warn("⚠️ WARNING:", message);
  }

  info(message: string): void {
    console.info("ℹ️ INFO:", message);
  }

  show(type: any, message: string): void {
    console.log(`[${type.toUpperCase()}]:`, message);
  }
}

export async function serverCreateNewProject(
  projectData: CreateProjectRequest,
  userId: number,
  projectRepository: ProjectRepository
): Promise<Project> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - CREATE PROJECT");
    console.log("--------------------------------");
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
    console.error("Error in serverCreateNewProject:", error);
    notifier.error("Failed to create project");
    throw new Error("Failed to create project");
  }
}

export async function serverUpdateExistingProject(
  id: number,
  projectData: UpdateProjectRequest,
  projectRepository: ProjectRepository
): Promise<void> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - UPDATE PROJECT");
    console.log("--------------------------------");
    console.log(`Updating project ${id} with data:`, projectData);

    await projectRepository.update(id, projectData);
    notifier.success("Project updated successfully!");
  } catch (error) {
    console.error("Error in serverUpdateExistingProject:", error);
    notifier.error("Failed to update project");
    throw new Error("Failed to update project");
  }
}

export async function serverDeleteExistingProject(
  id: number,
  projectRepository: ProjectRepository
): Promise<void> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - DELETE PROJECT");
    console.log("--------------------------------");
    console.log(`Deleting project ${id}`);

    await projectRepository.delete(id);
    notifier.success("Project deleted successfully!");
  } catch (error) {
    console.error("Error in serverDeleteExistingProject:", error);
    notifier.error("Failed to delete project");
    throw new Error("Failed to delete project");
  }
}

export async function serverGetAllProjects(
  projectRepository: ProjectRepository
): Promise<Project[]> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - GET ALL PROJECTS");
    console.log("--------------------------------");

    const projects = await projectRepository.getAll();
    console.log(`Retrieved ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error("Error in serverGetAllProjects:", error);
    notifier.error("Failed to fetch projects");
    throw new Error("Failed to fetch projects");
  }
}

export async function serverGetProjectById(
  id: number,
  projectRepository: ProjectRepository
): Promise<Project> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - GET PROJECT BY ID");
    console.log("--------------------------------");
    console.log(`Getting project ${id}`);

    const project = await projectRepository.getById(id);
    console.log("Project retrieved:", project.name);
    return project;
  } catch (error) {
    console.error("Error in serverGetProjectById:", error);
    notifier.error("Project not found");
    throw new Error("Project not found");
  }
}

// Server-side confident use cases
export async function serverCreateNewConfident(
  confidentData: CreateConfidentRequest,
  userId: number,
  confidentRepository: ConfidentRepository
): Promise<Confident> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - CREATE CONFIDENT");
    console.log("--------------------------------");
    console.log("Creating confident with data:", confidentData);
    console.log("User ID:", userId);

    // Add user_id to the confident data for API call
    const confidentDataWithUserId = {
      ...confidentData,
      user_id: userId,
    };

    const newConfident = createConfident(confidentDataWithUserId);

    if (!isConfidentValid(newConfident)) {
      throw new Error("Invalid confident data");
    }

    const response = await confidentRepository.create(confidentDataWithUserId);
    console.log("Confident created successfully:", response);
    notifier.success("Confident created successfully!");

    return response.confident;
  } catch (error) {
    console.error("Error in serverCreateNewConfident:", error);
    notifier.error("Failed to create confident");
    throw new Error("Failed to create confident");
  }
}

export async function serverUpdateExistingConfident(
  id: number,
  confidentData: UpdateConfidentRequest,
  confidentRepository: ConfidentRepository
): Promise<void> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - UPDATE CONFIDENT");
    console.log("--------------------------------");
    console.log(`Updating confident ${id} with data:`, confidentData);

    await confidentRepository.update(id, confidentData);
    notifier.success("Confident updated successfully!");
  } catch (error) {
    console.error("Error in serverUpdateExistingConfident:", error);
    notifier.error("Failed to update confident");
    throw new Error("Failed to update confident");
  }
}

export async function serverDeleteExistingConfident(
  id: number,
  confidentRepository: ConfidentRepository
): Promise<void> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - DELETE CONFIDENT");
    console.log("--------------------------------");
    console.log(`Deleting confident ${id}`);

    await confidentRepository.delete(id);
    notifier.success("Confident deleted successfully!");
  } catch (error) {
    console.error("Error in serverDeleteExistingConfident:", error);
    notifier.error("Failed to delete confident");
    throw new Error("Failed to delete confident");
  }
}

export async function serverGetAllConfidents(
  confidentRepository: ConfidentRepository
): Promise<Confident[]> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - GET ALL CONFIDENTS");
    console.log("--------------------------------");

    const confidents = await confidentRepository.getAll();
    console.log(`Retrieved ${confidents.length} confidents`);
    return confidents;
  } catch (error) {
    console.error("Error in serverGetAllConfidents:", error);
    notifier.error("Failed to fetch confidents");
    throw new Error("Failed to fetch confidents");
  }
}

// Server-side tag use cases
export async function serverCreateNewTag(
  tagData: CreateTagRequest,
  userId: number,
  tagRepository: TagRepository
): Promise<Tag> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - CREATE TAG");
    console.log("--------------------------------");
    console.log("Creating tag with data:", tagData);
    console.log("User ID:", userId);

    // Add user_id to the tag data for API call
    const tagDataWithUserId = {
      ...tagData,
      user_id: userId,
    };

    const newTag = createTag(tagDataWithUserId);

    if (!isTagValid(newTag)) {
      throw new Error("Invalid tag data");
    }

    const response = await tagRepository.create(tagDataWithUserId);
    console.log("Tag created successfully:", response);
    notifier.success("Tag created successfully!");

    return response.tag;
  } catch (error) {
    console.error("Error in serverCreateNewTag:", error);
    notifier.error("Failed to create tag");
    throw new Error("Failed to create tag");
  }
}

export async function serverUpdateExistingTag(
  id: number,
  tagData: UpdateTagRequest,
  tagRepository: TagRepository
): Promise<void> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - UPDATE TAG");
    console.log("--------------------------------");
    console.log(`Updating tag ${id} with data:`, tagData);

    await tagRepository.update(id, tagData);
    notifier.success("Tag updated successfully!");
  } catch (error) {
    console.error("Error in serverUpdateExistingTag:", error);
    notifier.error("Failed to update tag");
    throw new Error("Failed to update tag");
  }
}

export async function serverDeleteExistingTag(
  id: number,
  tagRepository: TagRepository
): Promise<void> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - DELETE TAG");
    console.log("--------------------------------");
    console.log(`Deleting tag ${id}`);

    await tagRepository.delete(id);
    notifier.success("Tag deleted successfully!");
  } catch (error) {
    console.error("Error in serverDeleteExistingTag:", error);
    notifier.error("Failed to delete tag");
    throw new Error("Failed to delete tag");
  }
}

export async function serverGetAllTags(
  tagRepository: TagRepository
): Promise<Tag[]> {
  const notifier = new ServerNotificationService();

  try {
    console.log("--------------------------------");
    console.log("SERVER USE CASE - GET ALL TAGS");
    console.log("--------------------------------");

    const tags = await tagRepository.getAll();
    console.log(`Retrieved ${tags.length} tags`);
    return tags;
  } catch (error) {
    console.error("Error in serverGetAllTags:", error);
    notifier.error("Failed to fetch tags");
    throw new Error("Failed to fetch tags");
  }
}
