import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/api-client";
import { queryKeys } from "../shared/query-keys";
import type { Tag, CreateTagRequest, UpdateTagRequest } from "../shared/types";
import {
  serverCreateNewTag,
  serverUpdateExistingTag,
  serverDeleteExistingTag,
} from "../../../application/use-cases/projects";
import { getServerUser } from "../../auth/server-auth";
import { createTagRepository } from "@/infrastructure/repositories";

// Client-side mutations
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

// Server-side mutation functions
export const tagServerMutationFunctions = {
  createTag: async (request: Request): Promise<Tag> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - CREATE TAG");
    console.log("--------------------------------");
    console.log("Creating tag via server mutation...");

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;

    if (!name) {
      throw new Error("Tag name is required");
    }

    const tagData: CreateTagRequest = {
      name,
      color: color || undefined,
    };

    const user = getServerUser(request);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const tagRepository = createTagRepository(request);
    const tag = await serverCreateNewTag(tagData, user.id, tagRepository);

    console.log("Tag created successfully via use case:", tag);
    return tag;
  },

  updateTag: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - UPDATE TAG");
    console.log("--------------------------------");
    console.log(`Updating tag ${id} via server mutation...`);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;

    if (!name) {
      throw new Error("Tag name is required");
    }

    const tagData: UpdateTagRequest = {
      name,
      color: color || undefined,
    };

    const tagRepository = createTagRepository(request);
    await serverUpdateExistingTag(id, tagData, tagRepository);

    console.log("Tag updated successfully via use case");
  },

  deleteTag: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - DELETE TAG");
    console.log("--------------------------------");
    console.log(`Deleting tag ${id} via server mutation...`);

    const tagRepository = createTagRepository(request);
    await serverDeleteExistingTag(id, tagRepository);

    console.log("Tag deleted successfully via use case");
  },
};
