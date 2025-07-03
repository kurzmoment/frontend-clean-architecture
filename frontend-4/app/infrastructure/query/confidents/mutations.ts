import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confidentsService, notificationService } from "../../../services";
import { queryKeys } from "../shared/query-keys";
import type {
  Confident,
  CreateConfidentData,
  UpdateConfidentData,
} from "../../../services";

// Client-side mutations
export function useCreateConfident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateConfidentData): Promise<Confident> => {
      const result = await confidentsService.create(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create confident");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.confidents });
      notificationService.success("Confident created successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
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
      data: UpdateConfidentData;
    }): Promise<void> => {
      const result = await confidentsService.update(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update confident");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.confidents });
      notificationService.success("Confident updated successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}

export function useDeleteConfident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const result = await confidentsService.delete(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete confident");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.confidents });
      notificationService.success("Confident deleted successfully!");
    },
    onError: (error: Error) => {
      notificationService.error(error.message);
    },
  });
}

export function useSearchConfidents() {
  return useMutation({
    mutationFn: async (query: string): Promise<Confident[]> => {
      const result = await confidentsService.search(query);
      if (!result.success) {
        throw new Error(result.message || "Failed to search confidents");
      }
      return result.data || [];
    },
  });
}
