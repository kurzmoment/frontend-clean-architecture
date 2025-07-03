// Simple projects service
import { apiService } from "./api";
import { authService } from "./auth";

export interface Project {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  confidents?: Confident[];
  tags?: Tag[];
}

export interface Confident {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  confident_ids?: number[];
  tag_ids?: number[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  confident_ids?: number[];
  tag_ids?: number[];
}

class ProjectsService {
  private async ensureAuth(): Promise<void> {
    // Check if user is authenticated (auth service should be initialized by now)
    if (!authService.isAuthenticated()) {
      throw new Error("User not authenticated");
    }
  }

  // Unified method for getting all projects
  async getAll(serverRequest?: Request): Promise<{
    success: boolean;
    data?: Project[];
    message?: string;
  }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.getProjects(serverRequest);

      if (response.ok) {
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          message: response.message || "Failed to fetch projects",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Unified method for getting single project
  async getById(
    id: number,
    serverRequest?: Request
  ): Promise<{ success: boolean; data?: Project; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.getProject(id, serverRequest);

      if (response.ok) {
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          message: response.message || "Project not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Create project
  async create(
    data: CreateProjectData,
    serverRequest?: Request
  ): Promise<{ success: boolean; data?: Project; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.createProject(data, serverRequest);

      if (response.ok) {
        return { success: true, data: response.data.project };
      } else {
        return {
          success: false,
          message: response.message || "Failed to create project",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Update project
  async update(
    id: number,
    data: UpdateProjectData,
    serverRequest?: Request
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.updateProject(id, data, serverRequest);

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "Failed to update project",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Delete project
  async delete(
    id: number,
    serverRequest?: Request
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.deleteProject(id, serverRequest);

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "Failed to delete project",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Add confident to project
  async addConfident(
    projectId: number,
    confidentId: number,
    serverRequest?: Request
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.customRequest(
        `/projects/${projectId}/confidents/${confidentId}`,
        { method: "POST" },
        serverRequest
      );

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "Failed to add confident to project",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || "Network error",
      };
    }
  }

  // Remove confident from project
  async removeConfident(
    projectId: number,
    confidentId: number,
    serverRequest?: Request
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Only check auth on client-side
      if (!serverRequest) {
        await this.ensureAuth();
      }

      const response = await apiService.customRequest(
        `/projects/${projectId}/confidents/${confidentId}`,
        { method: "DELETE" },
        serverRequest
      );

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message:
            response.message || "Failed to remove confident from project",
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

export const projectsService = new ProjectsService();
