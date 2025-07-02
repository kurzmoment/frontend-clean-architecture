import { apiClient } from "../api/api-client";
import type { UserRepository } from "../../domain/repositories/user-repository";
import type {
  User,
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
} from "../../shared-kernel";

// Factory function to create a client-side user repository
export function createUserRepository(request?: Request): UserRepository {
  return {
    async getAll(): Promise<User[]> {
      console.log("Client Repository: Getting all users");
      const response = await apiClient.get<User[]>("/users", request);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.data;
    },

    async getById(id: number): Promise<User> {
      console.log(`Client Repository: Getting user ${id}`);
      const response = await apiClient.get<User>(`/users/${id}`, request);
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.data;
    },

    async create(
      user: CreateUserRequest
    ): Promise<{ message: string; user: User }> {
      console.log("Client Repository: Creating user with data:", user);
      const response = await apiClient.post<{ message: string; user: User }>(
        "/users",
        user,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      return response.data;
    },

    async update(
      id: number,
      user: Partial<User>
    ): Promise<{ message: string }> {
      console.log(`Client Repository: Updating user ${id} with data:`, user);
      const response = await apiClient.put<{ message: string }>(
        `/users/${id}`,
        user,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      return response.data;
    },

    async delete(id: number): Promise<{ message: string }> {
      console.log(`Client Repository: Deleting user ${id}`);
      const response = await apiClient.delete<{ message: string }>(
        `/users/${id}`,
        request
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return response.data;
    },

    async login(credentials: LoginRequest): Promise<AuthResponse> {
      console.log("Client Repository: Logging in user");
      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials,
        request
      );
      if (!response.ok) {
        const errorMessage = response.data?.message || "Login failed";
        throw new Error(errorMessage);
      }

      // Backend already sets cookies, no need to store in localStorage
      return response.data;
    },

    async register(userData: CreateUserRequest): Promise<AuthResponse> {
      console.log("Client Repository: Registering user with data:", userData);
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        userData,
        request
      );
      if (!response.ok) {
        const errorMessage = response.data?.message || "Registration failed";
        throw new Error(errorMessage);
      }

      // Backend already sets cookies, no need to store in localStorage
      return response.data;
    },

    async getCurrentUser(): Promise<User | null> {
      console.log("Client Repository: Getting current user");
      try {
        const response = await apiClient.get<{ user: User }>(
          "/auth/me",
          request
        );
        if (!response.ok) {
          return null;
        }
        return response.data.user;
      } catch (error) {
        return null;
      }
    },

    async logout(): Promise<void> {
      console.log("Client Repository: Logging out user");
      try {
        await apiClient.post("/auth/logout", undefined, request);
        // Backend clears cookies, no need to clear localStorage
      } catch (error) {
        // Ignore logout errors
      }
    },
  };
}
