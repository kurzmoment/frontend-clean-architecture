import type { UserStorageService } from "../../application/services/user-storage-service";
import type { User } from "../../shared-kernel";

const isClient = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

const getCookie = (name: string): string | null => {
  if (!isClient()) return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const setCookie = (name: string, value: string, days: number = 7): void => {
  if (!isClient()) return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const removeCookie = (name: string): void => {
  if (!isClient()) return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const userStorageService: UserStorageService = {
  getUser(): User | null {
    if (!isClient()) return null;

    const userStr = getCookie("user");
    if (!userStr) return null;

    try {
      return JSON.parse(decodeURIComponent(userStr));
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    if (!isClient()) return;
    setCookie("user", encodeURIComponent(JSON.stringify(user)));
  },

  removeUser(): void {
    if (!isClient()) return;
    removeCookie("user");
  },

  getToken(): string | null {
    if (!isClient()) return null;
    return getCookie("authToken");
  },

  setToken(token: string): void {
    if (!isClient()) return;
    setCookie("authToken", token);
  },

  removeToken(): void {
    if (!isClient()) return;
    removeCookie("authToken");
  },

  isAuthenticated(): boolean {
    if (!isClient()) return false;
    return !!this.getToken() && !!this.getUser();
  },
};
