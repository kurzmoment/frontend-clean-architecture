import type { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import type {
  UserCredentials,
  UserRegistration,
  AuthResponse,
  User,
} from "../../domain/entities/User";
import { UserEntity } from "../../domain/entities/User";

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async login(
    credentials: UserCredentials
  ): Promise<{ user: UserEntity; token: string }> {
    try {
      const response = await this.authRepository.login(credentials);

      // Store token and user data in cookies
      setCookie("authToken", response.token, 7); // 7 days
      setCookie("user", JSON.stringify(response.user), 7);

      return {
        user: UserEntity.create(response.user),
        token: response.token,
      };
    } catch (error) {
      throw new Error("Login failed. Please check your credentials.");
    }
  }

  async register(
    userData: UserRegistration
  ): Promise<{ user: UserEntity; token: string }> {
    try {
      const response = await this.authRepository.register(userData);

      // Store token and user data in cookies
      setCookie("authToken", response.token, 7); // 7 days
      setCookie("user", JSON.stringify(response.user), 7);

      return {
        user: UserEntity.create(response.user),
        token: response.token,
      };
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    }
  }

  async getCurrentUser(): Promise<UserEntity | null> {
    try {
      const response = await this.authRepository.getCurrentUser();
      return UserEntity.create(response.user);
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint to clear server-side cookies
      await this.authRepository.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear client-side cookies
      deleteCookie("authToken");
      deleteCookie("user");
    }
  }

  isAuthenticated(): boolean {
    return !!getCookie("authToken");
  }

  getStoredUser(): UserEntity | null {
    const userData = getCookie("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return UserEntity.create(user);
      } catch {
        return null;
      }
    }
    return null;
  }
}
