import { apiClient } from "../api/api-client";
import type { TagRepository } from "../../domain/repositories/tag-repository";
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";

// Factory function to create a client-side tag repository
export function createTagRepository(request: Request): TagRepository {
  return {
    async getAll(): Promise<Tag[]> {
      console.log("Server Repository: Getting all tags");
      const response = await apiClient.get<Tag[]>("/tags", request);
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      return response.data;
    },

    async getById(id: number): Promise<Tag> {
      console.log(`Server Repository: Getting tag ${id}`);
      const response = await apiClient.get<Tag>(`/tags/${id}`, request);
      if (!response.ok) {
        throw new Error("Tag not found");
      }
      return response.data;
    },

    async create(
      tag: CreateTagRequest
    ): Promise<{ message: string; tag: Tag }> {
      console.log("Server Repository: Creating tag with data:", tag);
      const response = await apiClient.post<{ message: string; tag: Tag }>(
        "/tags",
        tag,
        request
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
      console.log(`Server Repository: Updating tag ${id} with data:`, tag);
      const response = await apiClient.put<{ message: string }>(
        `/tags/${id}`,
        tag,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to update tag");
      }
      return response.data;
    },

    async delete(id: number): Promise<{ message: string }> {
      console.log(`Server Repository: Deleting tag ${id}`);
      const response = await apiClient.delete<{ message: string }>(
        `/tags/${id}`,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }
      return response.data;
    },
  };
}
