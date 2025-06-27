import { apiClient } from "../api/client";
import type {
  UserCredentials,
  UserRegistration,
  AuthResponse,
  User,
} from "../../domain/entities/User";

export interface AuthRepository {
  login(credentials: UserCredentials): Promise<AuthResponse>;
  register(userData: UserRegistration): Promise<AuthResponse>;
  getCurrentUser(): Promise<{ user: User }>;
  logout(): Promise<{ message: string }>;
}

export class AuthRepositoryImpl implements AuthRepository {
  async login(credentials: UserCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    if (!response.ok) {
      throw new Error(response.data.message || "Login failed");
    }
    return response.data;
  }

  async register(userData: UserRegistration): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      userData
    );
    if (!response.ok) {
      throw new Error(response.data.message || "Registration failed");
    }
    return response.data;
  }

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>("/auth/me");
    if (!response.ok) {
      throw new Error("Failed to get current user");
    }
    return response.data;
  }

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>("/auth/logout");
    if (!response.ok) {
      throw new Error("Logout failed");
    }
    return response.data;
  }
}
