import { apiClient } from "../api/api-client";
import type { ConfidentRepository } from "../../domain/repositories/confident-repository";
import type {
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../shared-kernel";

// Factory function to create a client-side confident repository
export function createConfidentRepository(
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
