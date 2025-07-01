import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";
import type { TagRepository } from "../../domain/repositories/tag-repository";
import type { NotificationService } from "../services/notification-service";
import { createTag, isTagValid } from "../../domain/model/tag";

export async function getAllTags(
  tagRepository: TagRepository,
  notifier: NotificationService
): Promise<Tag[]> {
  try {
    const tags = await tagRepository.getAll();
    return tags;
  } catch (error) {
    notifier.error("Failed to fetch tags");
    throw new Error("Failed to fetch tags");
  }
}

export async function getTagById(
  id: number,
  tagRepository: TagRepository,
  notifier: NotificationService
): Promise<Tag> {
  try {
    const tag = await tagRepository.getById(id);
    return tag;
  } catch (error) {
    notifier.error("Tag not found");
    throw new Error("Tag not found");
  }
}

export async function createNewTag(
  tagData: CreateTagRequest,
  userId: number,
  tagRepository: TagRepository,
  notifier: NotificationService
): Promise<Tag> {
  try {
    // Add user_id to the tag data for API call
    const tagDataWithUserId = {
      ...tagData,
      user_id: userId,
    };

    const newTag = createTag(tagDataWithUserId);

    if (!isTagValid(newTag)) {
      throw new Error("Invalid tag data");
    }

    const response = await tagRepository.create(tagDataWithUserId);
    notifier.success("Tag created successfully!");

    return response.tag;
  } catch (error) {
    notifier.error("Failed to create tag");
    throw new Error("Failed to create tag");
  }
}

export async function updateExistingTag(
  id: number,
  tagData: UpdateTagRequest,
  tagRepository: TagRepository,
  notifier: NotificationService
): Promise<void> {
  try {
    await tagRepository.update(id, tagData);
    notifier.success("Tag updated successfully!");
  } catch (error) {
    notifier.error("Failed to update tag");
    throw new Error("Failed to update tag");
  }
}

export async function deleteExistingTag(
  id: number,
  tagRepository: TagRepository,
  notifier: NotificationService
): Promise<void> {
  try {
    await tagRepository.delete(id);
    notifier.success("Tag deleted successfully!");
  } catch (error) {
    notifier.error("Failed to delete tag");
    throw new Error("Failed to delete tag");
  }
}
