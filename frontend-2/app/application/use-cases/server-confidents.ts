import type {
  CreateConfidentRequest,
  UpdateConfidentRequest,
  Confident,
} from "../../shared-kernel";
import type { ConfidentRepository } from "../../domain/repositories/confident-repository";

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
