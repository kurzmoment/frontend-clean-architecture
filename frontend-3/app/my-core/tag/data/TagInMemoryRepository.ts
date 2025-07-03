import { TagRepository } from "../domain/TagRepository";
import { TagEntity, CreateTagData, UpdateTagData } from "../domain/Tag";
import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";

export class TagInMemoryRepository implements TagRepository {
  private tags: TagEntity[] = [];

  async getAll(userId: number): Promise<Either<DataError, TagEntity[]>> {
    try {
      const userTags = this.tags.filter((tag) => tag.user_id === userId);
      return Either.right(userTags);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }

  async getById(id: number): Promise<Either<DataError, TagEntity>> {
    try {
      const tag = this.tags.find((t) => t.id === id);
      if (!tag) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Tag not found"),
        });
      }
      return Either.right(tag);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }

  async create(
    data: CreateTagData,
    userId: number
  ): Promise<Either<DataError, TagEntity>> {
    try {
      const tag = TagEntity.create(data, userId);
      this.tags.push(tag);
      return Either.right(tag);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }

  async update(
    id: number,
    data: UpdateTagData,
    userId: number
  ): Promise<Either<DataError, TagEntity>> {
    try {
      const index = this.tags.findIndex(
        (t) => t.id === id && t.user_id === userId
      );
      if (index === -1) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Tag not found"),
        });
      }

      const updatedTag = this.tags[index].update(data);
      this.tags[index] = updatedTag;
      return Either.right(updatedTag);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }

  async delete(
    id: number,
    userId: number
  ): Promise<Either<DataError, boolean>> {
    try {
      const index = this.tags.findIndex(
        (t) => t.id === id && t.user_id === userId
      );
      if (index === -1) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Tag not found"),
        });
      }

      this.tags.splice(index, 1);
      return Either.right(true);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }
}
