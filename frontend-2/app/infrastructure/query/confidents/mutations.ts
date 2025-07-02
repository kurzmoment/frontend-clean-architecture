import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/api-client";
import { queryKeys } from "../shared/query-keys";
import type {
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../shared/types";
import {
  serverCreateNewConfident,
  serverUpdateExistingConfident,
  serverDeleteExistingConfident,
} from "../../../application/use-cases/projects";
import { getServerUser } from "../../auth/server-auth";
import { createConfidentRepository } from "@/infrastructure/repositories";

// Client-side mutations
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

// Server-side mutation functions
export const confidentServerMutationFunctions = {
  createConfident: async (request: Request): Promise<Confident> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - CREATE CONFIDENT");
    console.log("--------------------------------");
    console.log("Creating confident via server mutation...");

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;

    if (!name) {
      throw new Error("Confident name is required");
    }

    const confidentData: CreateConfidentRequest = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      company: company || undefined,
    };

    const user = getServerUser(request);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const confidentRepository = createConfidentRepository(request);
    const confident = await serverCreateNewConfident(
      confidentData,
      user.id,
      confidentRepository
    );

    console.log("Confident created successfully via use case:", confident);
    return confident;
  },

  updateConfident: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - UPDATE CONFIDENT");
    console.log("--------------------------------");
    console.log(`Updating confident ${id} via server mutation...`);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;

    if (!name) {
      throw new Error("Confident name is required");
    }

    const confidentData: UpdateConfidentRequest = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      company: company || undefined,
    };

    const confidentRepository = createConfidentRepository(request);
    await serverUpdateExistingConfident(id, confidentData, confidentRepository);

    console.log("Confident updated successfully via use case");
  },

  deleteConfident: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - DELETE CONFIDENT");
    console.log("--------------------------------");
    console.log(`Deleting confident ${id} via server mutation...`);

    const confidentRepository = createConfidentRepository(request);
    await serverDeleteExistingConfident(id, confidentRepository);

    console.log("Confident deleted successfully via use case");
  },
};
