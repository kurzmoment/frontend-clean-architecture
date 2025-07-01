// Detect if we're running on the server or client
const isServer = typeof window === "undefined";

// Use different base URLs for server and client
const API_BASE_URL = isServer
  ? // ? "http://localhost:5001/api" // Backend server URL for SSR
    "https://d24f-78-108-103-98.ngrok-free.app/api"
  : "/api"; // Relative URL for client (uses Vite proxy)

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  status: number;
  statusText: string;
}

const isClient = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

const getCookie = (name: string): string | null => {
  if (!isClient()) return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const getAuthHeaders = (): Record<string, string> => {
  if (!isClient()) return {};

  const token = getCookie("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  serverRequest?: Request
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: "include", // Include cookies
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  // For server-side requests, include cookies from the original request
  if (isServer && serverRequest) {
    const cookieHeader = serverRequest.headers.get("Cookie");
    if (cookieHeader) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Cookie: cookieHeader,
      };
    }
  }

  try {
    const response = await fetch(url, defaultOptions);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If response is not JSON, create a simple error object
      data = { message: response.statusText || "Unknown error" };
    }

    return {
      ok: response.ok,
      data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    return {
      ok: false,
      data: { message: "Network error" } as T,
      status: 0,
      statusText: "Network error",
    };
  }
};

export const apiClient = {
  get: <T>(
    endpoint: string,
    serverRequest?: Request
  ): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, { method: "GET" }, serverRequest);
  },

  post: <T>(
    endpoint: string,
    data?: any,
    serverRequest?: Request
  ): Promise<ApiResponse<T>> => {
    return request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      serverRequest
    );
  },

  put: <T>(
    endpoint: string,
    data?: any,
    serverRequest?: Request
  ): Promise<ApiResponse<T>> => {
    return request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      serverRequest
    );
  },

  delete: <T>(
    endpoint: string,
    serverRequest?: Request
  ): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, { method: "DELETE" }, serverRequest);
  },
};
