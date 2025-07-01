import { apiClient } from "../api/api-client";
import type { ConfidentRepository } from "../../domain/repositories/confident-repository";
import type {
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../shared-kernel";

export const confidentRepository: ConfidentRepository = {
  async getAll(): Promise<Confident[]> {
    const response = await apiClient.get<Confident[]>("/confidents");
    if (!response.ok) {
      throw new Error("Failed to fetch confidents");
    }
    return response.data;
  },

  async getById(id: number): Promise<Confident> {
    const response = await apiClient.get<Confident>(`/confidents/${id}`);
    if (!response.ok) {
      throw new Error("Confident not found");
    }
    return response.data;
  },

  async create(
    confident: CreateConfidentRequest
  ): Promise<{ message: string; confident: Confident }> {
    const response = await apiClient.post<{
      message: string;
      confident: Confident;
    }>("/confidents", confident);
    if (!response.ok) {
      throw new Error("Failed to create confident");
    }
    return response.data;
  },

  async update(
    id: number,
    confident: UpdateConfidentRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      `/confidents/${id}`,
      confident
    );
    if (!response.ok) {
      throw new Error("Failed to update confident");
    }
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/confidents/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to delete confident");
    }
    return response.data;
  },
};
