// Simple tags service
import { apiService } from "./api";
import { authService } from "./auth";

export interface Tag {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTagData {
  name: string;
  color: string;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
}

class TagsService {
  private async ensureAuth(): Promise<void> {
    // Check if user is authenticated (auth service should be initialized by now)
    if (!authService.isAuthenticated()) {
      throw new Error("User not authenticated");
    }
  }

  // Unified method for getting all tags
  async getAll(serverRequest?: Request): Promise<{
    success: boolean;
    data?: Tag[];
    message?: string;
  }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.getTags(serverRequest);

      if (response.ok) {
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          message: response.message || "Failed to fetch tags",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Create tag
  async create(
    data: CreateTagData,
    serverRequest?: Request
  ): Promise<{ success: boolean; data?: Tag; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.createTag(data, serverRequest);

      if (response.ok) {
        return { success: true, data: response.data.tag };
      } else {
        return {
          success: false,
          message: response.message || "Failed to create tag",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Update tag
  async update(
    id: number,
    data: UpdateTagData,
    serverRequest?: Request
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.updateTag(id, data, serverRequest);

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "Failed to update tag",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Delete tag
  async delete(
    id: number,
    serverRequest?: Request
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.deleteTag(id, serverRequest);

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "Failed to delete tag",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Get tag by ID
  async getById(
    id: number,
    serverRequest?: Request
  ): Promise<{ success: boolean; data?: Tag; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const allTags = await this.getAll(serverRequest);

      if (!allTags.success || !allTags.data) {
        return { success: false, message: allTags.message };
      }

      const tag = allTags.data.find((t) => t.id === id);

      if (tag) {
        return { success: true, data: tag };
      } else {
        return { success: false, message: "Tag not found" };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Utility method to get default colors for tag creation
  getDefaultColors(): string[] {
    return [
      "#ef4444", // red
      "#f97316", // orange
      "#eab308", // yellow
      "#22c55e", // green
      "#06b6d4", // cyan
      "#3b82f6", // blue
      "#8b5cf6", // violet
      "#ec4899", // pink
      "#6b7280", // gray
      "#000000", // black
    ];
  }
}

export const tagsService = new TagsService();
