import { apiClient } from "../api/api-client";

// Helper function to parse form data
const parseFormData = (formData: FormData) => {
  const data: any = {};

  for (const [key, value] of formData.entries()) {
    if (key === "intent" || key === "id") {
      data[key] = value;
      continue;
    }

    // Handle arrays (like confident_ids, tag_ids)
    if (key.endsWith("_ids")) {
      if (!data[key]) {
        data[key] = [];
      }
      data[key].push(parseInt(value as string));
    } else {
      data[key] = value;
    }
  }

  return data;
};

// Server-side mutation functions for React Router actions
export const serverMutationFunctions = {
  // Project mutations
  createProject: async (formData: FormData, request: Request) => {
    const data = parseFormData(formData);
    delete data.intent; // Remove intent from the data

    const response = await apiClient.post("/projects", data, request);
    if (!response.ok) {
      throw new Error(
        (response.data as any).message || "Failed to create project"
      );
    }
    return response.data;
  },

  updateProject: async (formData: FormData, id: number, request: Request) => {
    const data = parseFormData(formData);
    delete data.intent; // Remove intent from the data

    const response = await apiClient.put(`/projects/${id}`, data, request);
    if (!response.ok) {
      throw new Error(
        (response.data as any).message || "Failed to update project"
      );
    }
    return response.data;
  },

  deleteProject: async (request: Request, id: number) => {
    const response = await apiClient.delete(`/projects/${id}`, request);
    if (!response.ok) {
      throw new Error(
        (response.data as any).message || "Failed to delete project"
      );
    }
    return response.data;
  },

  // Confident mutations
  createConfident: async (formData: FormData, request: Request) => {
    const data = parseFormData(formData);
    delete data.intent; // Remove intent from the data

    const response = await apiClient.post("/confidents", data, request);
    if (!response.ok) {
      throw new Error(
        (response.data as any).message || "Failed to create confident"
      );
    }
    return response.data;
  },

  updateConfident: async (formData: FormData, id: number, request: Request) => {
    const data = parseFormData(formData);
    delete data.intent; // Remove intent from the data

    const response = await apiClient.put(`/confidents/${id}`, data, request);
    if (!response.ok) {
      throw new Error(
        (response.data as any).message || "Failed to update confident"
      );
    }
    return response.data;
  },

  deleteConfident: async (request: Request, id: number) => {
    const response = await apiClient.delete(`/confidents/${id}`, request);
    if (!response.ok) {
      throw new Error(
        (response.data as any).message || "Failed to delete confident"
      );
    }
    return response.data;
  },

  // Tag mutations
  createTag: async (formData: FormData, request: Request) => {
    const data = parseFormData(formData);
    delete data.intent; // Remove intent from the data

    const response = await apiClient.post("/tags", data, request);
    if (!response.ok) {
      throw new Error((response.data as any).message || "Failed to create tag");
    }
    return response.data;
  },

  updateTag: async (formData: FormData, id: number, request: Request) => {
    const data = parseFormData(formData);
    delete data.intent; // Remove intent from the data

    const response = await apiClient.put(`/tags/${id}`, data, request);
    if (!response.ok) {
      throw new Error((response.data as any).message || "Failed to update tag");
    }
    return response.data;
  },

  deleteTag: async (request: Request, id: number) => {
    const response = await apiClient.delete(`/tags/${id}`, request);
    if (!response.ok) {
      throw new Error((response.data as any).message || "Failed to delete tag");
    }
    return response.data;
  },
};
