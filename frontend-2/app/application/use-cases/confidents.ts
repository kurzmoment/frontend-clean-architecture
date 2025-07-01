import type {
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../shared-kernel";
import type { ConfidentRepository } from "../../domain/repositories/confident-repository";
import type { NotificationService } from "../services/notification-service";
import {
  createConfident,
  isConfidentValid,
} from "../../domain/model/confident";

export async function getAllConfidents(
  confidentRepository: ConfidentRepository,
  notifier: NotificationService
): Promise<Confident[]> {
  try {
    const confidents = await confidentRepository.getAll();
    return confidents;
  } catch (error) {
    notifier.error("Failed to fetch confidents");
    throw new Error("Failed to fetch confidents");
  }
}

export async function getConfidentById(
  id: number,
  confidentRepository: ConfidentRepository,
  notifier: NotificationService
): Promise<Confident> {
  try {
    const confident = await confidentRepository.getById(id);
    return confident;
  } catch (error) {
    notifier.error("Confident not found");
    throw new Error("Confident not found");
  }
}

export async function createNewConfident(
  confidentData: CreateConfidentRequest,
  userId: number,
  confidentRepository: ConfidentRepository,
  notifier: NotificationService
): Promise<Confident> {
  try {
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
    notifier.success("Confident created successfully!");

    return response.confident;
  } catch (error) {
    notifier.error("Failed to create confident");
    throw new Error("Failed to create confident");
  }
}

export async function updateExistingConfident(
  id: number,
  confidentData: UpdateConfidentRequest,
  confidentRepository: ConfidentRepository,
  notifier: NotificationService
): Promise<void> {
  try {
    await confidentRepository.update(id, confidentData);
    notifier.success("Confident updated successfully!");
  } catch (error) {
    notifier.error("Failed to update confident");
    throw new Error("Failed to update confident");
  }
}

export async function deleteExistingConfident(
  id: number,
  confidentRepository: ConfidentRepository,
  notifier: NotificationService
): Promise<void> {
  try {
    await confidentRepository.delete(id);
    notifier.success("Confident deleted successfully!");
  } catch (error) {
    notifier.error("Failed to delete confident");
    throw new Error("Failed to delete confident");
  }
}
