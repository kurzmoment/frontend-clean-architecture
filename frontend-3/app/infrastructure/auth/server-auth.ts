import { apiClient } from "../api/api-client";

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const serverAuth = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    if (!response.ok) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);

    if (!response.ok) {
      throw new Error(response.data.message || "Registration failed");
    }

    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>("/auth/me");

      if (!response.ok) {
        return null;
      }

      return response.data.user;
    } catch (error) {
      return null;
    }
  },
};

// Server-side authentication helpers for SSR
export const isServerAuthenticated = (request: Request): boolean => {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return false;

  // Check if auth token exists in cookies
  return cookieHeader.includes("authToken=");
};

export const getServerUser = async (request: Request): Promise<User | null> => {
  try {
    const response = await apiClient.get<{ user: User }>("/auth/me", request);

    if (!response.ok) {
      return null;
    }

    return response.data.user;
  } catch (error) {
    return null;
  }
};
