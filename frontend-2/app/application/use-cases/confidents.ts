import type {
  CreateConfidentRequest,
  UpdateConfidentRequest,
  Confident,
} from "../../shared-kernel";
import type { ConfidentRepository } from "../../domain/repositories/confident-repository";
import { ProjectRepository } from "@/domain/repositories/project-repository";
import { TagRepository } from "@/domain/repositories/tag-repository";

export async function serverCreateNewConfident(
  data: CreateConfidentRequest,
  userId: number,
  confidentRepository: ConfidentRepository
): Promise<Confident> {
  console.log("--------------------------------");
  console.log("SERVER USE CASE - CREATE CONFIDENT");
  console.log("--------------------------------");
  console.log("Creating confident with data:", data);
  console.log("User ID:", userId);

  // Validate required fields
  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Confident name is required");
  }

  // Create the confident
  const result = await confidentRepository.create(data);

  console.log("Confident created successfully:", result.confident);
  return result.confident;
}

export async function serverUpdateExistingConfident(
  id: number,
  data: UpdateConfidentRequest,
  confidentRepository: ConfidentRepository
): Promise<void> {
  console.log("--------------------------------");
  console.log("SERVER USE CASE - UPDATE CONFIDENT");
  console.log("--------------------------------");
  console.log("Updating confident with ID:", id);
  console.log("Update data:", data);

  // Validate required fields
  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Confident name is required");
  }

  // Check if confident exists
  const existingConfident = await confidentRepository.getById(id);
  if (!existingConfident) {
    throw new Error("Confident not found");
  }

  // Update the confident
  await confidentRepository.update(id, data);

  console.log("Confident updated successfully");
}

export async function serverDeleteExistingConfident(
  id: number,
  confidentRepository: ConfidentRepository
): Promise<void> {
  console.log("--------------------------------");
  console.log("SERVER USE CASE - DELETE CONFIDENT");
  console.log("--------------------------------");
  console.log("Deleting confident with ID:", id);

  // Check if confident exists
  const existingConfident = await confidentRepository.getById(id);
  if (!existingConfident) {
    throw new Error("Confident not found");
  }

  // Delete the confident
  await confidentRepository.delete(id);

  console.log("Confident deleted successfully");
}

export async function serverAddConfidentToProject(
  projectId: number,
  confidentId: number,
  projectRepository: ProjectRepository,
  confidentRepository: ConfidentRepository
): Promise<void> {
  console.log("--------------------------------");
  console.log("SERVER USE CASE - ADD CONFIDENT TO PROJECT");
  console.log("--------------------------------");
  console.log("Adding confident to project with ID:", projectId);
  console.log("Confident ID:", confidentId);

  // Check if project exists
  const existingProject = await projectRepository.getById(projectId);
  if (!existingProject) {
    throw new Error("Project not found");
  }

  // Check if confident exists
  const existingConfident = await confidentRepository.getById(confidentId);
  if (!existingConfident) {
    throw new Error("Confident not found");
  }

  // Add confident to project
  await projectRepository.addConfident(projectId, confidentId);

  console.log("Confident added to project successfully");
}

export async function serverAddTagsToProject(
  projectId: number,
  tagIds: number[],
  projectRepository: ProjectRepository,
  tagRepository: TagRepository
): Promise<void> {
  console.log("--------------------------------");
  console.log("SERVER USE CASE - ADD TAGS TO PROJECT");
  console.log("--------------------------------");
  console.log("Adding tags to project with ID:", projectId);
  console.log("Tag IDs:", tagIds);

  // Check if project exists
  const existingProject = await projectRepository.getById(projectId);
  if (!existingProject) {
    throw new Error("Project not found");
  }

  // Check if tags exist
  const allTags = await tagRepository.getAll();
  const existingTags = allTags.filter((tag) => tagIds.includes(tag.id));

  if (existingTags.length !== tagIds.length) {
    throw new Error("One or more tags not found");
  }

  // Add tags to project
  for (const tag of existingTags) {
    await projectRepository.addTag(projectId, tag.id);
  }
  console.log("Tags added to project successfully");
}
