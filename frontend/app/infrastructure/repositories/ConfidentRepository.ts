import { apiClient } from "../api/client";
import type {
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../domain/entities/Confident";

export interface ConfidentRepository {
  getAll(): Promise<Confident[]>;
  getById(id: number): Promise<Confident>;
  create(
    confident: CreateConfidentRequest
  ): Promise<{ message: string; confident: Confident }>;
  update(
    id: number,
    confident: UpdateConfidentRequest
  ): Promise<{ message: string }>;
  delete(id: number): Promise<{ message: string }>;
}

export class ConfidentRepositoryImpl implements ConfidentRepository {
  async getAll(): Promise<Confident[]> {
    const response = await apiClient.get<Confident[]>("/confidents");
    return response.data;
  }

  async getById(id: number): Promise<Confident> {
    const response = await apiClient.get<Confident>(`/confidents/${id}`);
    return response.data;
  }

  async create(
    confident: CreateConfidentRequest
  ): Promise<{ message: string; confident: Confident }> {
    const response = await apiClient.post<{
      message: string;
      confident: Confident;
    }>("/confidents", confident);
    return response.data;
  }

  async update(
    id: number,
    confident: UpdateConfidentRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      `/confidents/${id}`,
      confident
    );
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/confidents/${id}`
    );
    return response.data;
  }
}
