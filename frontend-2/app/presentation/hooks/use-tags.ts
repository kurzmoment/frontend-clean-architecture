import { useCallback } from "react";
import type { CreateTagRequest, UpdateTagRequest } from "../../shared-kernel";
import {
  getAllTags,
  getTagById,
  createNewTag,
  updateExistingTag,
  deleteExistingTag,
} from "../../application/use-cases/tags";
import { useTagRepository } from "./use-tag-repository";
import { useNotifier } from "./use-notifier";
import { useUserStorage } from "./use-user-storage";

export function useTags() {
  const tagRepository = useTagRepository();
  const notifier = useNotifier();
  const userStorage = useUserStorage();

  const getTags = useCallback(async () => {
    return getAllTags(tagRepository, notifier);
  }, [tagRepository, notifier]);

  const getTag = useCallback(
    async (id: number) => {
      return getTagById(id, tagRepository, notifier);
    },
    [tagRepository, notifier]
  );

  const createTag = useCallback(
    async (tagData: CreateTagRequest) => {
      const user = userStorage.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      return createNewTag(tagData, user.id, tagRepository, notifier);
    },
    [tagRepository, notifier, userStorage]
  );

  const updateTag = useCallback(
    async (id: number, tagData: UpdateTagRequest) => {
      return updateExistingTag(id, tagData, tagRepository, notifier);
    },
    [tagRepository, notifier]
  );

  const deleteTag = useCallback(
    async (id: number) => {
      return deleteExistingTag(id, tagRepository, notifier);
    },
    [tagRepository, notifier]
  );

  return {
    getAll: getTags,
    getById: getTag,
    create: createTag,
    update: updateTag,
    delete: deleteTag,
  };
}
