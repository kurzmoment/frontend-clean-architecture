import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { apiClient } from "../../infrastructure/api/api-client";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../shared-kernel";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Project[]> {
  try {
    console.log("Loading projects on server...");
    const response = await apiClient.get<Project[]>("/projects", request);

    if (!response.ok) {
      throw new Response("Failed to load projects", {
        status: response.status,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Projects loader error:", error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Failed to load projects", { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const formData = await request.formData();
  const method = (formData.get("_method") as string) || request.method;
  const projectId = url.searchParams.get("id");

  try {
    if (method === "POST" || method === "post") {
      // Create new project
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const confidentIds = formData.getAll("confidentIds") as string[];
      const tagIds = formData.getAll("tagIds") as string[];

      if (!name) {
        throw new Response("Project name is required", { status: 400 });
      }

      const projectData: CreateProjectRequest = {
        name,
        description: description || "",
        confident_ids: confidentIds.map((id) => parseInt(id)),
        tag_ids: tagIds.map((id) => parseInt(id)),
      };

      const response = await apiClient.post<{
        message: string;
        project: Project;
      }>("/projects", projectData);

      if (!response.ok) {
        throw new Response("Failed to create project", {
          status: response.status,
        });
      }

      return {
        success: true,
        message: "Project created successfully",
        project: response.data.project,
      };
    }

    if (method === "PUT" || method === "put") {
      // Update existing project
      if (!projectId) {
        throw new Response("Project ID is required for updates", {
          status: 400,
        });
      }

      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const confidentIds = formData.getAll("confidentIds") as string[];
      const tagIds = formData.getAll("tagIds") as string[];

      if (!name) {
        throw new Response("Project name is required", { status: 400 });
      }

      const projectData: UpdateProjectRequest = {
        name,
        description: description || "",
        confident_ids: confidentIds.map((id) => parseInt(id)),
        tag_ids: tagIds.map((id) => parseInt(id)),
      };

      const response = await apiClient.put<{ message: string }>(
        `/projects/${projectId}`,
        projectData
      );

      if (!response.ok) {
        throw new Response("Failed to update project", {
          status: response.status,
        });
      }

      return { success: true, message: "Project updated successfully" };
    }

    if (method === "DELETE" || method === "delete") {
      // Delete project
      if (!projectId) {
        throw new Response("Project ID is required for deletion", {
          status: 400,
        });
      }

      const response = await apiClient.delete<{ message: string }>(
        `/projects/${projectId}`
      );

      if (!response.ok) {
        throw new Response("Failed to delete project", {
          status: response.status,
        });
      }

      return { success: true, message: "Project deleted successfully" };
    }

    throw new Response(`Method ${method} not allowed`, { status: 405 });
  } catch (error) {
    console.error("Projects action error:", error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Internal server error", { status: 500 });
  }
}
