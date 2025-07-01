import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/api-client";
import { queryKeys } from "./queries";
import type {
  Project,
  Confident,
  Tag,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateConfidentRequest,
  UpdateConfidentRequest,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";

// Project mutations
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectRequest): Promise<Project> => {
      const response = await apiClient.post<{ project: Project }>(
        "/projects",
        data
      );
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return response.data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
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
      data: UpdateProjectRequest;
    }): Promise<void> => {
      const response = await apiClient.put(`/projects/${id}`, data);
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await apiClient.delete(`/projects/${id}`);
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

// Confident mutations
export function useCreateConfident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateConfidentRequest): Promise<Confident> => {
      const response = await apiClient.post<{ confident: Confident }>(
        "/confidents",
        data
      );
      if (!response.ok) {
        throw new Error("Failed to create confident");
      }
      return response.data.confident;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.confidents });
    },
  });
}

export function useUpdateConfident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateConfidentRequest;
    }): Promise<void> => {
      const response = await apiClient.put(`/confidents/${id}`, data);
      if (!response.ok) {
        throw new Error("Failed to update confident");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.confidents });
    },
  });
}

export function useDeleteConfident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await apiClient.delete(`/confidents/${id}`);
      if (!response.ok) {
        throw new Error("Failed to delete confident");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.confidents });
    },
  });
}

// Tag mutations
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTagRequest): Promise<Tag> => {
      const response = await apiClient.post<{ tag: Tag }>("/tags", data);
      if (!response.ok) {
        throw new Error("Failed to create tag");
      }
      return response.data.tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTagRequest;
    }): Promise<void> => {
      const response = await apiClient.put(`/tags/${id}`, data);
      if (!response.ok) {
        throw new Error("Failed to update tag");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await apiClient.delete(`/tags/${id}`);
      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}
