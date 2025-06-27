// Detect if we're running on the server or client
const isServer = typeof window === "undefined";

// Use different base URLs for server and client
const API_BASE_URL = isServer
  ? "http://localhost:5001/api" // Backend server URL for SSR
  : "/api"; // Relative URL for client (uses Vite proxy)

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    request?: Request
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // For server-side requests, include cookies from the original request
    if (isServer && request) {
      const cookieHeader = request.headers.get("Cookie");
      if (cookieHeader) {
        defaultOptions.headers = {
          ...defaultOptions.headers,
          Cookie: cookieHeader,
        };
      }
    }

    console.log("Making request to:", url);
    console.log("Request options:", defaultOptions);

    try {
      const response = await fetch(url, defaultOptions);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        console.error("Response not ok:", response.status, response.statusText);
        // Try to get error message from response
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        return {
          data: errorData,
          status: response.status,
          ok: false,
        };
      }

      const data = await response.json();
      console.log("Response data:", data);

      return {
        data,
        status: response.status,
        ok: true,
      };
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(`API request failed: ${error}`);
    }
  }

  async get<T>(endpoint: string, request?: Request): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" }, request);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    request?: Request
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      request
    );
  }

  async put<T>(
    endpoint: string,
    data?: any,
    request?: Request
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      request
    );
  }

  async delete<T>(
    endpoint: string,
    request?: Request
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" }, request);
  }
}

export const apiClient = new ApiClient();
