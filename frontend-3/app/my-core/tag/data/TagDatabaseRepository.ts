import { TagRepository } from "../domain/TagRepository";
import { TagEntity, CreateTagData, UpdateTagData } from "../domain/Tag";
import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";
import { apiClient } from "../../../infrastructure/api/api-client";

export class TagDatabaseRepository implements TagRepository {
  async getAll(userId: number): Promise<Either<DataError, TagEntity[]>> {
    try {
      const response = await apiClient.get<any[]>("/tags");

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to fetch tags"),
        });
      }

      const tags = response.data.map((tag) => TagEntity.fromJSON(tag));

      return Either.right(tags);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async getById(
    id: number,
    userId: number
  ): Promise<Either<DataError, TagEntity>> {
    try {
      const response = await apiClient.get<any>(`/tags/${id}`);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to fetch tag"),
        });
      }

      const tag = TagEntity.fromJSON(response.data);
      return Either.right(tag);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async create(
    data: CreateTagData,
    userId: number
  ): Promise<Either<DataError, TagEntity>> {
    try {
      const response = await apiClient.post<any>("/tags", data);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to create tag"),
        });
      }

      const tag = TagEntity.fromJSON(response.data.tag);
      return Either.right(tag);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async update(
    id: number,
    data: UpdateTagData,
    userId: number
  ): Promise<Either<DataError, TagEntity>> {
    try {
      const response = await apiClient.put<any>(`/tags/${id}`, data);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to update tag"),
        });
      }

      // Since the API doesn't return the updated tag, we need to fetch it
      return this.getById(id, userId);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async delete(
    id: number,
    userId: number
  ): Promise<Either<DataError, boolean>> {
    try {
      const response = await apiClient.delete<any>(`/tags/${id}`);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to delete tag"),
        });
      }

      return Either.right(true);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }
}
