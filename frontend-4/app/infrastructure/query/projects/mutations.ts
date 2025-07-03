import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsService, notificationService } from "../../../services";
import { queryKeys } from "../shared/query-keys";
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
} from "../../../services";

// Client-side mutations
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectData): Promise<Project> => {
      const result = await projectsService.create(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create project");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      notificationService.success("Project created successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProjectData;
    }): Promise<void> => {
      const result = await projectsService.update(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      notificationService.success("Project updated successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const result = await projectsService.delete(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      notificationService.success("Project deleted successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}

export function useAddConfidentToProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      confidentId,
    }: {
      projectId: number;
      confidentId: number;
    }): Promise<void> => {
      const result = await projectsService.addConfident(projectId, confidentId);
      if (!result.success) {
        throw new Error(result.message || "Failed to add confident to project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      notificationService.success("Confident added to project!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}

export function useRemoveConfidentFromProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      confidentId,
    }: {
      projectId: number;
      confidentId: number;
    }): Promise<void> => {
      const result = await projectsService.removeConfident(
        projectId,
        confidentId
      );
      if (!result.success) {
        throw new Error(
          result.message || "Failed to remove confident from project"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      notificationService.success("Confident removed from project!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}
