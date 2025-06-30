import type { TagRepository } from "../../infrastructure/repositories/TagRepository";
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../domain/entities/Tag";
import { TagEntity } from "../../domain/entities/Tag";

export class TagService {
  constructor(private tagRepository: TagRepository) {}

  async getAllTags(): Promise<TagEntity[]> {
    try {
      const tags = await this.tagRepository.getAll();
      return tags.map((tag) => TagEntity.create(tag));
    } catch (error) {
      throw new Error("Failed to fetch tags");
    }
  }

  async getTagById(id: number): Promise<TagEntity> {
    try {
      const tag = await this.tagRepository.getById(id);
      return TagEntity.create(tag);
    } catch (error) {
      throw new Error("Tag not found");
    }
  }

  async createTag(tagData: CreateTagRequest): Promise<TagEntity> {
    try {
      const response = await this.tagRepository.create(tagData);
      return TagEntity.create(response.tag);
    } catch (error) {
      throw new Error("Failed to create tag");
    }
  }

  async updateTag(id: number, tagData: UpdateTagRequest): Promise<void> {
    try {
      await this.tagRepository.update(id, tagData);
    } catch (error) {
      throw new Error("Failed to update tag");
    }
  }

  async deleteTag(id: number): Promise<void> {
    try {
      await this.tagRepository.delete(id);
    } catch (error) {
      throw new Error("Failed to delete tag");
    }
  }
}
