import type { UserStorageService } from "../../application/services/user-storage-service";
import { userStorageService } from "../../infrastructure/services/user-storage-service-impl";

export function useUserStorage(): UserStorageService {
  return userStorageService;
}
