import { useQuery } from "@tanstack/react-query";
import { tagsService, authService } from "../../../services";
import { queryKeys } from "../shared/query-keys";
import type { Tag } from "../../../services";

// Unified query functions
const tagQueryFunctions = {
  tags: async (serverRequest?: Request): Promise<Tag[]> => {
    // Only check auth on client-side
    if (!serverRequest) {
      // Ensure auth service is initialized
      await authService.initialize();

      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        throw new Error("User not authenticated");
      }
    }

    const result = await tagsService.getAll(serverRequest);
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch tags");
    }
    return result.data || [];
  },

  tag: async (id: number, serverRequest?: Request): Promise<Tag> => {
    // Only check auth on client-side
    if (!serverRequest) {
      // Ensure auth service is initialized
      await authService.initialize();

      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        throw new Error("User not authenticated");
      }
    }

    const result = await tagsService.getById(id, serverRequest);
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch tag");
    }
    return result.data!;
  },
};

// Query hooks
export function useTags(initialData?: Tag[]) {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: () => tagQueryFunctions.tags(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData,
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (error.message === "User not authenticated") {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useTagsServer(request: Request, initialData?: Tag[]) {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: () => tagQueryFunctions.tags(request),
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData,
  });
}

export function useTag(id: number) {
  return useQuery({
    queryKey: queryKeys.tag(id),
    queryFn: () => tagQueryFunctions.tag(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (error.message === "User not authenticated") {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useTagServer(id: number, request: Request, initialData?: Tag) {
  return useQuery({
    queryKey: queryKeys.tag(id),
    queryFn: () => tagQueryFunctions.tag(id, request),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    initialData,
  });
}

// Export query functions for use in loaders
export { tagQueryFunctions };
