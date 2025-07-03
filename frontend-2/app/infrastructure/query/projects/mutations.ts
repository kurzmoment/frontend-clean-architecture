import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/api-client";
import { queryKeys } from "../shared/query-keys";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../shared/types";
import {
  serverCreateNewProject,
  serverUpdateExistingProject,
  serverDeleteExistingProject,
} from "../../../application/use-cases/projects";
import { getServerUser } from "../../auth/server-auth";
import {
  createConfidentRepository,
  createProjectRepository,
  createTagRepository,
} from "@/infrastructure/repositories";
import {
  serverAddConfidentToProject,
  serverAddTagsToProject,
} from "@/application/use-cases/confidents";

// Client-side mutations
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectRequest): Promise<Project> => {
      const response = await apiClient.post<{ project: Project }>(
        "/projects",
        data
      );
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return response.data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProjectRequest;
    }): Promise<void> => {
      const response = await apiClient.put(`/projects/${id}`, data);
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await apiClient.delete(`/projects/${id}`);
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

// Server-side mutation functions
export const projectServerMutationFunctions = {
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

    const user = getServerUser(request);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const projectRepository = createProjectRepository(request);
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

    const user = getServerUser(request);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const projectRepository = createProjectRepository(request);
    const project = await serverCreateNewProject(
      projectData,
      user.id,
      projectRepository
    );

    const confidentRepository = createConfidentRepository(request);
    const tagRepository = createTagRepository(request);

    if (projectData.confident_ids) {
      for (const confidentId of projectData.confident_ids) {
        await serverAddConfidentToProject(
          project.id,
          confidentId,
          projectRepository,
          confidentRepository
        );
      }
    }

    if (projectData.tag_ids) {
      await serverAddTagsToProject(
        project.id,
        projectData.tag_ids,
        projectRepository,
        tagRepository
      );
    }

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

    const projectRepository = createProjectRepository(request);
    const tagsRespository = createTagRepository(request);
    const confidentsRespository = createConfidentRepository(request);

    await serverUpdateExistingProject(id, projectData, projectRepository);

    if (projectData.confident_ids) {
      for (const confidentId of projectData.confident_ids) {
        await serverAddConfidentToProject(
          id,
          confidentId,
          projectRepository,
          confidentsRespository
        );
      }
    }

    if (projectData.tag_ids) {
      await serverAddTagsToProject(
        id,
        projectData.tag_ids,
        projectRepository,
        tagsRespository
      );
    }

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

    const projectRepository = createProjectRepository(request);
    const tagsRespository = createTagRepository(request);
    const confidentsRespository = createConfidentRepository(request);

    await serverUpdateExistingProject(id, projectData, projectRepository);

    console.log("projectData", projectData);

    if (projectData.confident_ids) {
      for (const confidentId of projectData.confident_ids) {
        await serverAddConfidentToProject(
          id,
          confidentId,
          projectRepository,
          confidentsRespository
        );
      }
    }

    if (projectData.tag_ids) {
      await serverAddTagsToProject(
        id,
        projectData.tag_ids,
        projectRepository,
        tagsRespository
      );
    }
    console.log("Project updated successfully via use case");
  },

  deleteProject: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - DELETE PROJECT");
    console.log("--------------------------------");
    console.log(`Deleting project ${id} via server mutation...`);

    const projectRepository = createProjectRepository(request);
    await serverDeleteExistingProject(id, projectRepository);

    console.log("Project deleted successfully via use case");
  },

  addConfidentToProject: async (
    request: Request,
    id: number
  ): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - ADD CONFIDENT TO PROJECT");
    console.log("--------------------------------");
    console.log(`Adding confident to project ${id} via server mutation...`);

    const formData = await request.formData();

    const confidentId = formData.get("confident_id") as string;

    if (!confidentId) {
      throw new Error("Confident ID is required");
    }

    const projectRepository = createProjectRepository(request);
    const confidentRepository = createConfidentRepository(request);
    await serverAddConfidentToProject(
      id,
      parseInt(confidentId),
      projectRepository,
      confidentRepository
    );

    console.log("Confident added to project successfully via use case");
  },

  addTagsToProject: async (request: Request, id: number): Promise<void> => {
    console.log("--------------------------------");
    console.log("SERVER MUTATION - ADD TAGS TO PROJECT");
    console.log("--------------------------------");
    console.log(`Adding tags to project ${id} via server mutation...`);

    const formData = await request.formData();
    const tagIds = formData
      .getAll("tag_ids")
      .map((id) => parseInt(id as string));

    if (tagIds.length === 0) {
      throw new Error("At least one tag is required");
    }

    const projectRepository = createProjectRepository(request);
    const tagRepository = createTagRepository(request);
    await serverAddTagsToProject(id, tagIds, projectRepository, tagRepository);

    console.log("Tags added to project successfully via use case");
  },
};
