import { apiClient } from "../api/client";
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../domain/entities/Tag";

export interface TagRepository {
  getAll(): Promise<Tag[]>;
  getById(id: number): Promise<Tag>;
  create(tag: CreateTagRequest): Promise<{ message: string; tag: Tag }>;
  update(id: number, tag: UpdateTagRequest): Promise<{ message: string }>;
  delete(id: number): Promise<{ message: string }>;
}

export class TagRepositoryImpl implements TagRepository {
  async getAll(): Promise<Tag[]> {
    const response = await apiClient.get<Tag[]>("/tags");
    return response.data;
  }

  async getById(id: number): Promise<Tag> {
    const response = await apiClient.get<Tag>(`/tags/${id}`);
    return response.data;
  }

  async create(tag: CreateTagRequest): Promise<{ message: string; tag: Tag }> {
    const response = await apiClient.post<{ message: string; tag: Tag }>(
      "/tags",
      tag
    );
    return response.data;
  }

  async update(
    id: number,
    tag: UpdateTagRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      `/tags/${id}`,
      tag
    );
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/tags/${id}`);
    return response.data;
  }
}
