import type { UserRepository } from "../../domain/repositories/user-repository";
import { createUserRepository } from "../../infrastructure/repositories/user-repository-impl";

export function useUserRepository(): UserRepository {
  return createUserRepository();
}
