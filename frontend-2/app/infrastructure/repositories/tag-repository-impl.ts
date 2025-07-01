import { apiClient } from "../api/api-client";
import type { TagRepository } from "../../domain/repositories/tag-repository";
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";

export const tagRepository: TagRepository = {
  async getAll(): Promise<Tag[]> {
    const response = await apiClient.get<Tag[]>("/tags");
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    return response.data;
  },

  async getById(id: number): Promise<Tag> {
    const response = await apiClient.get<Tag>(`/tags/${id}`);
    if (!response.ok) {
      throw new Error("Tag not found");
    }
    return response.data;
  },

  async create(tag: CreateTagRequest): Promise<{ message: string; tag: Tag }> {
    const response = await apiClient.post<{ message: string; tag: Tag }>(
      "/tags",
      tag
    );
    if (!response.ok) {
      throw new Error("Failed to create tag");
    }
    return response.data;
  },

  async update(
    id: number,
    tag: UpdateTagRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      `/tags/${id}`,
      tag
    );
    if (!response.ok) {
      throw new Error("Failed to update tag");
    }
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/tags/${id}`);
    if (!response.ok) {
      throw new Error("Failed to delete tag");
    }
    return response.data;
  },
};
