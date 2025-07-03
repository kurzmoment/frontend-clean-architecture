import { useState, useCallback } from "react";
import { serverAuth } from "../../infrastructure/auth/server-auth";
import type {
  LoginCredentials,
  RegisterData,
  User,
} from "../../infrastructure/auth/server-auth";

export const useAuthenticate = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await serverAuth.login(credentials);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await serverAuth.register(data);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await serverAuth.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await serverAuth.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout,
    getCurrentUser,
  };
};
