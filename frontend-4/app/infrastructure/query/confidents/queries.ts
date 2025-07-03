import { useQuery } from "@tanstack/react-query";
import { confidentsService, authService } from "../../../services";
import { queryKeys } from "../shared/query-keys";
import type { Confident } from "../../../services";

// Unified query functions
const confidentQueryFunctions = {
  confidents: async (serverRequest?: Request): Promise<Confident[]> => {
    // Only check auth on client-side
    if (!serverRequest) {
      // Ensure auth service is initialized
      await authService.initialize();

      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        throw new Error("User not authenticated");
      }
    }

    const result = await confidentsService.getAll(serverRequest);
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch confidents");
    }
    return result.data || [];
  },

  confident: async (
    id: number,
    serverRequest?: Request
  ): Promise<Confident> => {
    // Only check auth on client-side
    if (!serverRequest) {
      // Ensure auth service is initialized
      await authService.initialize();

      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        throw new Error("User not authenticated");
      }
    }

    const result = await confidentsService.getById(id, serverRequest);
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch confident");
    }
    return result.data!;
  },
};

// Query hooks
export function useConfidents(initialData?: Confident[]) {
  return useQuery({
    queryKey: queryKeys.confidents,
    queryFn: () => confidentQueryFunctions.confidents(),
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

export function useConfidentsServer(
  request: Request,
  initialData?: Confident[]
) {
  return useQuery({
    queryKey: queryKeys.confidents,
    queryFn: () => confidentQueryFunctions.confidents(request),
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData,
  });
}

export function useConfident(id: number) {
  return useQuery({
    queryKey: queryKeys.confident(id),
    queryFn: () => confidentQueryFunctions.confident(id),
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

export function useConfidentServer(
  id: number,
  request: Request,
  initialData?: Confident
) {
  return useQuery({
    queryKey: queryKeys.confident(id),
    queryFn: () => confidentQueryFunctions.confident(id, request),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    initialData,
  });
}

// Export query functions for use in loaders
export { confidentQueryFunctions };
