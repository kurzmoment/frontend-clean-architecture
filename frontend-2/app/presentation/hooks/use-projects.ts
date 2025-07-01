import { useCallback } from "react";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../shared-kernel";
import {
  getAllProjects,
  getProjectById,
  createNewProject,
  updateExistingProject,
  deleteExistingProject,
  addConfidentToProject,
  addTagToProject,
} from "../../application/use-cases/projects";
import { useProjectRepository } from "./use-project-repository";
import { useNotifier } from "./use-notifier";
import { useUserStorage } from "./use-user-storage";

export function useProjects() {
  const projectRepository = useProjectRepository();
  const notifier = useNotifier();
  const userStorage = useUserStorage();

  const getProjects = useCallback(async () => {
    return getAllProjects(projectRepository, notifier);
  }, [projectRepository, notifier]);

  const getProject = useCallback(
    async (id: number) => {
      return getProjectById(id, projectRepository, notifier);
    },
    [projectRepository, notifier]
  );

  const createProject = useCallback(
    async (projectData: CreateProjectRequest) => {
      const user = userStorage.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      return createNewProject(
        projectData,
        user.id,
        projectRepository,
        notifier
      );
    },
    [projectRepository, notifier, userStorage]
  );

  const updateProject = useCallback(
    async (id: number, projectData: UpdateProjectRequest) => {
      return updateExistingProject(
        id,
        projectData,
        projectRepository,
        notifier
      );
    },
    [projectRepository, notifier]
  );

  const deleteProject = useCallback(
    async (id: number) => {
      return deleteExistingProject(id, projectRepository, notifier);
    },
    [projectRepository, notifier]
  );

  const addConfident = useCallback(
    async (projectId: number, confidentId: number) => {
      return addConfidentToProject(
        projectId,
        confidentId,
        projectRepository,
        notifier
      );
    },
    [projectRepository, notifier]
  );

  const addTag = useCallback(
    async (projectId: number, tagId: number) => {
      return addTagToProject(projectId, tagId, projectRepository, notifier);
    },
    [projectRepository, notifier]
  );

  return {
    getAll: getProjects,
    getById: getProject,
    create: createProject,
    update: updateProject,
    delete: deleteProject,
    addConfident,
    addTag,
  };
}
