import type {
  User,
  LoginRequest,
  CreateUserRequest,
  AuthResponse,
} from "../../shared-kernel";
import type { UserRepository } from "../../domain/repositories/user-repository";
import type { NotificationService } from "../services/notification-service";
import type { UserStorageService } from "../services/user-storage-service";

export async function authenticate(
  credentials: LoginRequest,
  userRepository: UserRepository,
  notifier: NotificationService,
  userStorage: UserStorageService
): Promise<{ user: User; token: string }> {
  try {
    const response = await userRepository.login(credentials);

    // Set client-side cookies for frontend access
    userStorage.setToken(response.token);
    userStorage.setUser(response.user);

    notifier.success("Successfully logged in!");

    return {
      user: response.user,
      token: response.token,
    };
  } catch (error) {
    notifier.error("Login failed. Please check your credentials.");
    throw new Error("Authentication failed");
  }
}

export async function register(
  userData: CreateUserRequest,
  userRepository: UserRepository,
  notifier: NotificationService,
  userStorage: UserStorageService
): Promise<{ user: User; token: string }> {
  try {
    const response = await userRepository.register(userData);

    // Set client-side cookies for frontend access
    userStorage.setToken(response.token);
    userStorage.setUser(response.user);

    notifier.success("Account created successfully!");

    return {
      user: response.user,
      token: response.token,
    };
  } catch (error) {
    notifier.error("Registration failed. Please try again.");
    throw new Error("Registration failed");
  }
}

export async function getCurrentUser(
  userRepository: UserRepository
): Promise<User | null> {
  try {
    return await userRepository.getCurrentUser();
  } catch (error) {
    return null;
  }
}

export async function logout(
  userRepository: UserRepository,
  notifier: NotificationService,
  userStorage: UserStorageService
): Promise<void> {
  try {
    await userRepository.logout();

    // Clear client-side cookies
    userStorage.removeToken();
    userStorage.removeUser();

    notifier.success("Successfully logged out!");
  } catch (error) {
    notifier.error("Logout failed.");
  }
}
