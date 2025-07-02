import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/api-client";
import type {
  Project,
  Confident,
  Tag,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateConfidentRequest,
  UpdateConfidentRequest,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";
import {
  serverCreateNewProject,
  serverUpdateExistingProject,
  serverDeleteExistingProject,
  serverGetAllProjects,
  serverGetProjectById,
  serverCreateNewConfident,
  serverUpdateExistingConfident,
  serverDeleteExistingConfident,
  serverGetAllConfidents,
  serverCreateNewTag,
  serverUpdateExistingTag,
  serverDeleteExistingTag,
  serverGetAllTags,
} from "../../application/use-cases/server-projects";
import {
  createServerProjectRepository,
  createServerConfidentRepository,
  createServerTagRepository,
} from "../repositories/server-project-repository";
import { getServerUser } from "../auth/server-auth";

// Query keys
export const queryKeys = {
  projects: ["projects"] as const,
  confidents: ["confidents"] as const,
  tags: ["tags"] as const,
  project: (id: number) => ["project", id] as const,
  confident: (id: number) => ["confident", id] as const,
  tag: (id: number) => ["tag", id] as const,
};

// Client-side query functions (for useQuery hooks)
const clientQueryFunctions = {
  projects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects");
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return response.data;
  },

  confidents: async (): Promise<Confident[]> => {
    const response = await apiClient.get<Confident[]>("/confidents");
    if (!response.ok) {
      throw new Error("Failed to fetch confidents");
    }
    return response.data;
  },

  tags: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>("/tags");
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    return response.data;
  },
};

// Server-side query functions (for loaders)
export const serverQueryFunctions = {
  projects: async (request: Request): Promise<Project[]> => {
    console.log("--------------------------------");
    console.log("SERVER QUERY FUNCTIONS - PROJECTS");
    console.log("--------------------------------");
    console.log("Loading projects via serverQueryFunctions...");

    // Create server repository and use application use case
    const projectRepository = createServerProjectRepository(request);
    const projects = await serverGetAllProjects(projectRepository);

    console.log(`Retrieved ${projects.length} projects via use case`);
    return projects;
  },

  confidents: async (request: Request): Promise<Confident[]> => {
    console.log("--------------------------------");
    console.log("SERVER QUERY FUNCTIONS - CONFIDENTS");
    console.log("--------------------------------");
    console.log("Loading confidents via serverQueryFunctions...");

    // Create server repository and use application use case
    const confidentRepository = createServerConfidentRepository(request);
    const confidents = await serverGetAllConfidents(confidentRepository);

    console.log(`Retrieved ${confidents.length} confidents via use case`);
    return confidents;
  },

  tags: async (request: Request): Promise<Tag[]> => {
    console.log("--------------------------------");
    console.log("SERVER QUERY FUNCTIONS - TAGS");
    console.log("--------------------------------");
    console.log("Loading tags via serverQueryFunctions...");

    // Create server repository and use application use case
    const tagRepository = createServerTagRepository(request);
    const tags = await serverGetAllTags(tagRepository);

    console.log(`Retrieved ${tags.length} tags via use case`);
    return tags;
  },
};

// Query hooks
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: clientQueryFunctions.projects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useConfidents() {
  return useQuery({
    queryKey: queryKeys.confidents,
    queryFn: clientQueryFunctions.confidents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: clientQueryFunctions.tags,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Server-side mutation functions (for actions)
export const serverMutationFunctions = {
  createProject: async (request: Request): Promise<Project> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - CREATE PROJECT");
    console.log("--------------------------------");
    console.log("Creating project via server mutation...");

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const confidentIds = formData
      .getAll("confident_ids")
      .map((id) => parseInt(id as string));
    const tagIds = formData
      .getAll("tag_ids")
      .map((id) => parseInt(id as string));

    if (!name) {
      throw new Error("Project name is required");
    }

    const projectData: CreateProjectRequest = {
      name,
      description: description || undefined,
      confident_ids: confidentIds.length > 0 ? confidentIds : undefined,
      tag_ids: tagIds.length > 0 ? tagIds : undefined,
    };

    // Get user from request for use case
    const user = getServerUser(request);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create server repository and use application use case
    const projectRepository = createServerProjectRepository(request);
    const project = await serverCreateNewProject(
      projectData,
      user.id,
      projectRepository
    );

    console.log("Project created successfully via use case:", project);
    return project;
  },

  createProjectFromFormData: async (
    formData: FormData,
    request: Request
  ): Promise<Project> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - CREATE PROJECT FROM FORMDATA");
    console.log("--------------------------------");
    console.log("Creating project via server mutation...");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const confidentIds = formData
      .getAll("confident_ids")
      .map((id) => parseInt(id as string));
    const tagIds = formData
      .getAll("tag_ids")
      .map((id) => parseInt(id as string));

    if (!name) {
      throw new Error("Project name is required");
    }

    const projectData: CreateProjectRequest = {
      name,
      description: description || undefined,
      confident_ids: confidentIds.length > 0 ? confidentIds : undefined,
      tag_ids: tagIds.length > 0 ? tagIds : undefined,
    };

    // Get user from request for use case
    const user = getServerUser(request);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create server repository and use application use case
    const projectRepository = createServerProjectRepository(request);
    const project = await serverCreateNewProject(
      projectData,
      user.id,
      projectRepository
    );

    console.log("Project created successfully via use case:", project);
    return project;
  },

  updateProject: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - UPDATE PROJECT");
    console.log("--------------------------------");
    console.log(`Updating project ${id} via server mutation...`);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const confidentIds = formData
      .getAll("confident_ids")
      .map((id) => parseInt(id as string));
    const tagIds = formData
      .getAll("tag_ids")
      .map((id) => parseInt(id as string));

    if (!name) {
      throw new Error("Project name is required");
    }

    const projectData: UpdateProjectRequest = {
      name,
      description: description || undefined,
      confident_ids: confidentIds.length > 0 ? confidentIds : undefined,
      tag_ids: tagIds.length > 0 ? tagIds : undefined,
    };

    // Create server repository and use application use case
    const projectRepository = createServerProjectRepository(request);
    await serverUpdateExistingProject(id, projectData, projectRepository);

    console.log("Project updated successfully via use case");
  },

  updateProjectFromFormData: async (
    formData: FormData,
    id: number,
    request: Request
  ): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - UPDATE PROJECT FROM FORMDATA");
    console.log("--------------------------------");
    console.log(`Updating project ${id} via server mutation...`);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const confidentIds = formData
      .getAll("confident_ids")
      .map((id) => parseInt(id as string));
    const tagIds = formData
      .getAll("tag_ids")
      .map((id) => parseInt(id as string));

    if (!name) {
      throw new Error("Project name is required");
    }

    const projectData: UpdateProjectRequest = {
      name,
      description: description || undefined,
      confident_ids: confidentIds.length > 0 ? confidentIds : undefined,
      tag_ids: tagIds.length > 0 ? tagIds : undefined,
    };

    // Create server repository and use application use case
    const projectRepository = createServerProjectRepository(request);
    await serverUpdateExistingProject(id, projectData, projectRepository);

    console.log("Project updated successfully via use case");
  },

  deleteProject: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - DELETE PROJECT");
    console.log("--------------------------------");
    console.log(`Deleting project ${id} via server mutation...`);

    // Create server repository and use application use case
    const projectRepository = createServerProjectRepository(request);
    await serverDeleteExistingProject(id, projectRepository);

    console.log("Project deleted successfully via use case");
  },

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

    // Get user from request for use case
    const user = getServerUser(request);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create server repository and use application use case
    const confidentRepository = createServerConfidentRepository(request);
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

    // Create server repository and use application use case
    const confidentRepository = createServerConfidentRepository(request);
    await serverUpdateExistingConfident(id, confidentData, confidentRepository);

    console.log("Confident updated successfully via use case");
  },

  deleteConfident: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - DELETE CONFIDENT");
    console.log("--------------------------------");
    console.log(`Deleting confident ${id} via server mutation...`);

    // Create server repository and use application use case
    const confidentRepository = createServerConfidentRepository(request);
    await serverDeleteExistingConfident(id, confidentRepository);

    console.log("Confident deleted successfully via use case");
  },

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

    // Get user from request for use case
    const user = getServerUser(request);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create server repository and use application use case
    const tagRepository = createServerTagRepository(request);
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

    // Create server repository and use application use case
    const tagRepository = createServerTagRepository(request);
    await serverUpdateExistingTag(id, tagData, tagRepository);

    console.log("Tag updated successfully via use case");
  },

  deleteTag: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - DELETE TAG");
    console.log("--------------------------------");
    console.log(`Deleting tag ${id} via server mutation...`);

    // Create server repository and use application use case
    const tagRepository = createServerTagRepository(request);
    await serverDeleteExistingTag(id, tagRepository);

    console.log("Tag deleted successfully via use case");
  },
};
