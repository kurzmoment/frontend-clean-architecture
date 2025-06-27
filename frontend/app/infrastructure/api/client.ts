const API_BASE_URL = "http://localhost:5001/api";

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
    options: RequestInit = {}
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

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
