import { useState, useEffect, useCallback } from "react";
import type { User } from "../../infrastructure/auth/server-auth";

const USER_STORAGE_KEY = "currentUser";

export const useUserStorage = () => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, []);

  const setUserStorage = useCallback((userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const getUser = useCallback(() => {
    return user;
  }, [user]);

  const clearUser = useCallback(() => {
    setUserStorage(null);
  }, [setUserStorage]);

  return {
    user,
    setUser: setUserStorage,
    getUser,
    clearUser,
  };
};
