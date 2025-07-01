import type { UserRepository } from "../../domain/repositories/user-repository";
import { userRepository } from "../../infrastructure/repositories/user-repository-impl";

export function useUserRepository(): UserRepository {
  return userRepository;
}
