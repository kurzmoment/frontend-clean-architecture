import { useCallback } from "react";
import type {
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../shared-kernel";
import {
  getAllConfidents,
  getConfidentById,
  createNewConfident,
  updateExistingConfident,
  deleteExistingConfident,
} from "../../application/use-cases/confidents";
import { useConfidentRepository } from "./use-confident-repository";
import { useNotifier } from "./use-notifier";
import { useUserStorage } from "./use-user-storage";

export function useConfidents() {
  const confidentRepository = useConfidentRepository();
  const notifier = useNotifier();
  const userStorage = useUserStorage();

  const getConfidents = useCallback(async () => {
    return getAllConfidents(confidentRepository, notifier);
  }, [confidentRepository, notifier]);

  const getConfident = useCallback(
    async (id: number) => {
      return getConfidentById(id, confidentRepository, notifier);
    },
    [confidentRepository, notifier]
  );

  const createConfident = useCallback(
    async (confidentData: CreateConfidentRequest) => {
      const user = userStorage.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      return createNewConfident(
        confidentData,
        user.id,
        confidentRepository,
        notifier
      );
    },
    [confidentRepository, notifier, userStorage]
  );

  const updateConfident = useCallback(
    async (id: number, confidentData: UpdateConfidentRequest) => {
      return updateExistingConfident(
        id,
        confidentData,
        confidentRepository,
        notifier
      );
    },
    [confidentRepository, notifier]
  );

  const deleteConfident = useCallback(
    async (id: number) => {
      return deleteExistingConfident(id, confidentRepository, notifier);
    },
    [confidentRepository, notifier]
  );

  return {
    getAll: getConfidents,
    getById: getConfident,
    create: createConfident,
    update: updateConfident,
    delete: deleteConfident,
  };
}
