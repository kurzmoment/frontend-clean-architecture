// Simple confidents service
import { apiService } from "./api";
import { authService } from "./auth";

export interface Confident {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateConfidentData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
}

export interface UpdateConfidentData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
}

class ConfidentsService {
  private async ensureAuth(): Promise<void> {
    // Check if user is authenticated (auth service should be initialized by now)
    if (!authService.isAuthenticated()) {
      throw new Error("User not authenticated");
    }
  }

  // Unified method for getting all confidents
  async getAll(serverRequest?: Request): Promise<{
    success: boolean;
    data?: Confident[];
    message?: string;
  }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.getConfidents(serverRequest);

      if (response.ok) {
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          message: response.message || "Failed to fetch confidents",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Unified method for getting single confident
  async getById(
    id: number,
    serverRequest?: Request
  ): Promise<{ success: boolean; data?: Confident; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.getConfident(id, serverRequest);

      if (response.ok) {
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          message: response.message || "Confident not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Create confident
  async create(
    data: CreateConfidentData,
    serverRequest?: Request
  ): Promise<{ success: boolean; data?: Confident; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.createConfident(data, serverRequest);

      if (response.ok) {
        return { success: true, data: response.data.confident };
      } else {
        return {
          success: false,
          message: response.message || "Failed to create confident",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Update confident
  async update(
    id: number,
    data: UpdateConfidentData,
    serverRequest?: Request
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.updateConfident(
        id,
        data,
        serverRequest
      );

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "Failed to update confident",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Delete confident
  async delete(
    id: number,
    serverRequest?: Request
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.deleteConfident(id, serverRequest);

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "Failed to delete confident",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Search confidents
  async search(
    query: string,
    serverRequest?: Request
  ): Promise<{ success: boolean; data?: Confident[]; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.customRequest<Confident[]>(
        `/confidents/search?q=${encodeURIComponent(query)}`,
        {},
        serverRequest
      );

      if (response.ok) {
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          message: response.message || "Failed to search confidents",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }
}

export const confidentsService = new ConfidentsService();
