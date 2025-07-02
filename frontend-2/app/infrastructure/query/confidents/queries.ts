import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/api-client";
import { queryKeys } from "../shared/query-keys";
import type { Confident } from "../shared/types";
import { serverGetAllConfidents } from "../../../application/use-cases/projects";
import { createConfidentRepository } from "@/infrastructure/repositories";

// Client-side query functions
const clientQueryFunctions = {
  confidents: async (): Promise<Confident[]> => {
    const response = await apiClient.get<Confident[]>("/confidents");
    if (!response.ok) {
      throw new Error("Failed to fetch confidents");
    }
    return response.data;
  },
};

// Server-side query functions
export const confidentServerQueryFunctions = {
  confidents: async (request: Request): Promise<Confident[]> => {
    console.log("--------------------------------");
    console.log("SERVER QUERY FUNCTIONS - CONFIDENTS");
    console.log("--------------------------------");
    console.log("Loading confidents via serverQueryFunctions...");

    const confidentRepository = createConfidentRepository(request);
    const confidents = await serverGetAllConfidents(confidentRepository);

    console.log(`Retrieved ${confidents.length} confidents via use case`);
    return confidents;
  },
};

// Query hooks
export function useConfidents() {
  return useQuery({
    queryKey: queryKeys.confidents,
    queryFn: clientQueryFunctions.confidents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
