import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsService, notificationService } from "../../../services";
import { queryKeys } from "../shared/query-keys";
import type { Tag, CreateTagData, UpdateTagData } from "../../../services";

// Client-side mutations
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTagData): Promise<Tag> => {
      const result = await tagsService.create(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create tag");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
      notificationService.success("Tag created successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
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
      data: UpdateTagData;
    }): Promise<void> => {
      const result = await tagsService.update(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update tag");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
      notificationService.success("Tag updated successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const result = await tagsService.delete(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete tag");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
      notificationService.success("Tag deleted successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}
