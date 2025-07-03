// Simple API service for all HTTP requests
import { CookieService } from "./cookie";
import { authService } from "./auth";

const API_BASE_URL = "http://localhost:5001/api";

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    serverRequest?: Request
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Merge with provided headers
    if (options.headers) {
      Object.assign(defaultHeaders, options.headers);
    }

    // Handle authentication - unified approach
    let token: string | null = null;

    if (serverRequest) {
      // Server-side: extract token from request
      const requestUrl = new URL(serverRequest.url);
      token =
        serverRequest.headers.get("Authorization")?.replace("Bearer ", "") ||
        requestUrl.searchParams.get("token") ||
        serverRequest.headers.get("Cookie")?.match(/authToken=([^;]+)/)?.[1] ||
        null;

      // Add cookie headers from the original request
      const originalCookies = serverRequest.headers.get("Cookie");
      if (originalCookies) {
        defaultHeaders["Cookie"] = originalCookies;
      }
    } else {
      // Client-side: get token from cookie
      token = CookieService.getAuthToken();

      // Add cookie headers to include all cookies in the request
      if (typeof document !== "undefined" && document.cookie) {
        defaultHeaders["Cookie"] = document.cookie;
      }
    }

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
        message: data.message,
      };
    } catch (error) {
      return {
        ok: false,
        data: null as T,
        message: "Network error",
      };
    }
  }

  // Unified project endpoints
  async getProjects(serverRequest?: Request) {
    return this.request<any[]>("/projects", {}, serverRequest);
  }

  async getProject(id: number, serverRequest?: Request) {
    return this.request<any>(`/projects/${id}`, {}, serverRequest);
  }

  async createProject(data: any, serverRequest?: Request) {
    return this.request<any>(
      "/projects",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      serverRequest
    );
  }

  async updateProject(id: number, data: any, serverRequest?: Request) {
    return this.request<any>(
      `/projects/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      serverRequest
    );
  }

  async deleteProject(id: number, serverRequest?: Request) {
    return this.request<any>(
      `/projects/${id}`,
      {
        method: "DELETE",
      },
      serverRequest
    );
  }

  // Unified confident endpoints
  async getConfidents(serverRequest?: Request) {
    return this.request<any[]>("/confidents", {}, serverRequest);
  }

  async getConfident(id: number, serverRequest?: Request) {
    return this.request<any>(`/confidents/${id}`, {}, serverRequest);
  }

  async createConfident(data: any, serverRequest?: Request) {
    return this.request<any>(
      "/confidents",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      serverRequest
    );
  }

  async updateConfident(id: number, data: any, serverRequest?: Request) {
    return this.request<any>(
      `/confidents/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      serverRequest
    );
  }

  async deleteConfident(id: number, serverRequest?: Request) {
    return this.request<any>(
      `/confidents/${id}`,
      {
        method: "DELETE",
      },
      serverRequest
    );
  }

  // Unified tag endpoints
  async getTags(serverRequest?: Request) {
    return this.request<any[]>("/tags", {}, serverRequest);
  }

  async createTag(data: any, serverRequest?: Request) {
    return this.request<any>(
      "/tags",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      serverRequest
    );
  }

  async updateTag(id: number, data: any, serverRequest?: Request) {
    return this.request<any>(
      `/tags/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      serverRequest
    );
  }

  async deleteTag(id: number, serverRequest?: Request) {
    return this.request<any>(
      `/tags/${id}`,
      {
        method: "DELETE",
      },
      serverRequest
    );
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    username: string;
  }) {
    return this.request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Generic request method for custom endpoints
  async customRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    serverRequest?: Request
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, options, serverRequest);
  }
}

export const apiService = new ApiService();
