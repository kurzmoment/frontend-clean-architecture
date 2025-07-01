import { apiClient } from "../api/api-client";
import type { UserRepository } from "../../domain/repositories/user-repository";
import type {
  User,
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
} from "../../shared-kernel";

export const userRepository: UserRepository = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>("/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    if (!response.ok) {
      throw new Error("User not found");
    }
    return response.data;
  },

  async create(
    user: CreateUserRequest
  ): Promise<{ message: string; user: User }> {
    const response = await apiClient.post<{ message: string; user: User }>(
      "/users",
      user
    );
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return response.data;
  },

  async update(id: number, user: Partial<User>): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      `/users/${id}`,
      user
    );
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `/users/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return response.data;
  },

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    if (!response.ok) {
      const errorMessage = response.data?.message || "Login failed";
      throw new Error(errorMessage);
    }

    // Backend already sets cookies, no need to store in localStorage
    return response.data;
  },

  async register(userData: CreateUserRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      userData
    );
    if (!response.ok) {
      const errorMessage = response.data?.message || "Registration failed";
      throw new Error(errorMessage);
    }

    // Backend already sets cookies, no need to store in localStorage
    return response.data;
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

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
      // Backend clears cookies, no need to clear localStorage
    } catch (error) {
      // Ignore logout errors
    }
  },
};
