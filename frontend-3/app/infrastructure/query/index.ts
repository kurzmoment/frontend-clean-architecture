// This file provides basic query functions for existing routes
// that haven't been migrated to the clean architecture yet

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/api-client";

// Basic query functions for existing routes
export const useConfidents = () => {
  return useQuery({
    queryKey: ["confidents"],
    queryFn: async () => {
      const response = await apiClient.get<any[]>("/confidents");
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to fetch confidents"
        );
      }
      return response.data;
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await apiClient.get<any[]>("/projects");
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to fetch projects"
        );
      }
      return response.data;
    },
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await apiClient.get<any[]>("/tags");
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to fetch tags"
        );
      }
      return response.data;
    },
  });
};

// Basic mutation functions
export const useCreateConfident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/confidents", data);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to create confident"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["confidents"] });
    },
  });
};

export const useUpdateConfident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiClient.put(`/confidents/${id}`, data);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to update confident"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["confidents"] });
    },
  });
};

export const useDeleteConfident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/confidents/${id}`);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to delete confident"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["confidents"] });
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/projects", data);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to create project"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiClient.put(`/projects/${id}`, data);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to update project"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/projects/${id}`);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to delete project"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/tags", data);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to create tag"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiClient.put(`/tags/${id}`, data);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to update tag"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/tags/${id}`);
      if (!response.ok) {
        throw new Error(
          (response.data as any).message || "Failed to delete tag"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

// Export server mutation functions
export { serverMutationFunctions } from "./server-mutations";

// Server functions for SSR
export const serverQueryFunctions = {
  confidents: async (request?: Request) => {
    const response = await apiClient.get<any[]>("/confidents", request);
    if (!response.ok) {
      throw new Error(
        (response.data as any).message || "Failed to fetch confidents"
      );
    }
    return response.data;
  },
  projects: async (request?: Request) => {
    const response = await apiClient.get<any[]>("/projects", request);
    if (!response.ok) {
      throw new Error(
        (response.data as any).message || "Failed to fetch projects"
      );
    }
    return response.data;
  },
  tags: async (request?: Request) => {
    const response = await apiClient.get<any[]>("/tags", request);
    if (!response.ok) {
      throw new Error((response.data as any).message || "Failed to fetch tags");
    }
    return response.data;
  },
};
