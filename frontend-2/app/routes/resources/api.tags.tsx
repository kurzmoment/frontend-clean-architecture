import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { apiClient } from "../../infrastructure/api/api-client";
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";

export async function loader({ request }: LoaderFunctionArgs): Promise<Tag[]> {
  console.log("Loading tags on server...");
  try {
    console.log("Loading tags on server...");

    const response = await apiClient.get<Tag[]>("/tags", request);

    if (!response.ok) {
      throw new Response("Failed to load tags", {
        status: response.status,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Tags loader error:", error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Failed to load tags", { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const formData = await request.formData();
  const method = (formData.get("_method") as string) || request.method;
  const tagId = url.searchParams.get("id");

  try {
    if (method === "POST" || method === "post") {
      // Create new tag
      const name = formData.get("name") as string;
      const color = formData.get("color") as string;

      if (!name) {
        throw new Response("Tag name is required", { status: 400 });
      }

      const tagData: CreateTagRequest = {
        name,
        color: color || undefined,
      };

      const response = await apiClient.post<{ message: string; tag: Tag }>(
        "/tags",
        tagData
      );

      if (!response.ok) {
        throw new Response("Failed to create tag", { status: response.status });
      }

      return {
        success: true,
        message: "Tag created successfully",
        tag: response.data.tag,
      };
    }

    if (method === "PUT" || method === "put") {
      // Update existing tag
      if (!tagId) {
        throw new Response("Tag ID is required for updates", { status: 400 });
      }

      const name = formData.get("name") as string;
      const color = formData.get("color") as string;

      if (!name) {
        throw new Response("Tag name is required", { status: 400 });
      }

      const tagData: UpdateTagRequest = {
        name,
        color: color || undefined,
      };

      const response = await apiClient.put<{ message: string }>(
        `/tags/${tagId}`,
        tagData
      );

      if (!response.ok) {
        throw new Response("Failed to update tag", { status: response.status });
      }

      return { success: true, message: "Tag updated successfully" };
    }

    if (method === "DELETE" || method === "delete") {
      // Delete tag
      if (!tagId) {
        throw new Response("Tag ID is required for deletion", { status: 400 });
      }

      const response = await apiClient.delete<{ message: string }>(
        `/tags/${tagId}`
      );

      if (!response.ok) {
        throw new Response("Failed to delete tag", { status: response.status });
      }

      return { success: true, message: "Tag deleted successfully" };
    }

    throw new Response(`Method ${method} not allowed`, { status: 405 });
  } catch (error) {
    console.error("Tags action error:", error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Internal server error", { status: 500 });
  }
}
