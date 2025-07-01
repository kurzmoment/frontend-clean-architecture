import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { apiClient } from "../../infrastructure/api/api-client";
import type {
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../shared-kernel";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Confident[]> {
  try {
    console.log("Loading confidents on server...");

    const response = await apiClient.get<Confident[]>("/confidents", request);

    if (!response.ok) {
      throw new Response("Failed to load confidents", {
        status: response.status,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Confidents loader error:", error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Failed to load confidents", { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const formData = await request.formData();
  const method = (formData.get("_method") as string) || request.method;
  const confidentId = url.searchParams.get("id");

  try {
    if (method === "POST" || method === "post") {
      // Create new confident
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const company = formData.get("company") as string;
      const position = formData.get("position") as string;
      const notes = formData.get("notes") as string;

      if (!name) {
        throw new Response("Confident name is required", { status: 400 });
      }

      const confidentData: CreateConfidentRequest = {
        name,
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        position: position || undefined,
        notes: notes || undefined,
      };

      const response = await apiClient.post<{
        message: string;
        confident: Confident;
      }>("/confidents", confidentData);

      if (!response.ok) {
        throw new Response("Failed to create confident", {
          status: response.status,
        });
      }

      return {
        success: true,
        message: "Confident created successfully",
        confident: response.data.confident,
      };
    }

    if (method === "PUT" || method === "put") {
      // Update existing confident
      if (!confidentId) {
        throw new Response("Confident ID is required for updates", {
          status: 400,
        });
      }

      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const company = formData.get("company") as string;
      const position = formData.get("position") as string;
      const notes = formData.get("notes") as string;

      if (!name) {
        throw new Response("Confident name is required", { status: 400 });
      }

      const confidentData: UpdateConfidentRequest = {
        name,
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        position: position || undefined,
        notes: notes || undefined,
      };

      const response = await apiClient.put<{ message: string }>(
        `/confidents/${confidentId}`,
        confidentData
      );

      if (!response.ok) {
        throw new Response("Failed to update confident", {
          status: response.status,
        });
      }

      return { success: true, message: "Confident updated successfully" };
    }

    if (method === "DELETE" || method === "delete") {
      // Delete confident
      if (!confidentId) {
        throw new Response("Confident ID is required for deletion", {
          status: 400,
        });
      }

      const response = await apiClient.delete<{ message: string }>(
        `/confidents/${confidentId}`
      );

      if (!response.ok) {
        throw new Response("Failed to delete confident", {
          status: response.status,
        });
      }

      return { success: true, message: "Confident deleted successfully" };
    }

    throw new Response(`Method ${method} not allowed`, { status: 405 });
  } catch (error) {
    console.error("Confidents action error:", error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Internal server error", { status: 500 });
  }
}
