import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/api-client";
import { queryKeys } from "../shared/query-keys";
import type { Tag } from "../shared/types";
import { serverGetAllTags } from "../../../application/use-cases/projects";
import { createTagRepository } from "@/infrastructure/repositories";

// Client-side query functions
const clientQueryFunctions = {
  tags: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>("/tags");
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    return response.data;
  },
};

// Server-side query functions
export const tagServerQueryFunctions = {
  tags: async (request: Request): Promise<Tag[]> => {
    console.log("--------------------------------");
    console.log("SERVER QUERY FUNCTIONS - TAGS");
    console.log("--------------------------------");
    console.log("Loading tags via serverQueryFunctions...");

    const tagRepository = createTagRepository(request);
    const tags = await serverGetAllTags(tagRepository);

    console.log(`Retrieved ${tags.length} tags via use case`);
    return tags;
  },
};

// Query hooks
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: clientQueryFunctions.tags,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
