import type { User } from "../../shared-kernel";

export interface UserStorageService {
  getUser(): User | null;
  setUser(user: User): void;
  removeUser(): void;
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  isAuthenticated(): boolean;
}
