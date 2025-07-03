import { useCallback } from "react";
import type { LoginRequest, CreateUserRequest } from "../../shared-kernel";
import {
  authenticate,
  register,
  getCurrentUser,
  logout,
} from "../../application/use-cases/authenticate";
import { useUserRepository } from "./use-user-repository";
import { useNotifier } from "./use-notifier";
import { useUserStorage } from "./use-user-storage";

export function useAuthenticate() {
  const userRepository = useUserRepository();
  const notifier = useNotifier();
  const userStorage = useUserStorage();

  const login = useCallback(
    async (credentials: LoginRequest) => {
      return authenticate(credentials, userRepository, notifier, userStorage);
    },
    [userRepository, notifier, userStorage]
  );

  const registerUser = useCallback(
    async (userData: CreateUserRequest) => {
      return register(userData, userRepository, notifier, userStorage);
    },
    [userRepository, notifier, userStorage]
  );

  const getCurrentUserData = useCallback(async () => {
    return getCurrentUser(userRepository);
  }, [userRepository]);

  const logoutUser = useCallback(async () => {
    return logout(userRepository, notifier, userStorage);
  }, [userRepository, notifier, userStorage]);

  return {
    login,
    register: registerUser,
    getCurrentUser: getCurrentUserData,
    logout: logoutUser,
  };
}
