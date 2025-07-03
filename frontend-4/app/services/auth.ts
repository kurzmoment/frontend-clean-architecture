// Simple auth service for managing authentication
import { apiService } from "./api";
import { CookieService } from "./cookie";

export interface User {
  id: number;
  email: string;
  username: string;
  name?: string; // Optional name field for display purposes
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  // Get current auth state
  getState(): AuthState {
    return { ...this.state };
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  // Update state and notify listeners
  private setState(updates: Partial<AuthState>) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  // Check if user is authenticated on app start
  async initialize() {
    const authStatus = CookieService.getAuthStatus();
    const authToken = CookieService.getAuthToken();

    if (authStatus === "authenticated" && authToken) {
      // Set authenticated state immediately without verification to avoid circular dependency
      this.setState({
        isAuthenticated: true,
        isLoading: false,
      });

      // Note: We skip server verification here to avoid circular dependency
      // The token will be verified on the first actual API request
    } else {
      // No auth status or token found (either not authenticated or server-side rendering)
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  // Login user
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    this.setState({ isLoading: true });

    try {
      const response = await apiService.login({ email, password });

      if (response.ok && response.data.token) {
        CookieService.setAuthStatus("authenticated");
        CookieService.setAuthToken(response.data.token);

        this.setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        this.setState({ isLoading: false });
        return {
          success: false,
          message: response.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      this.setState({ isLoading: false });
      return {
        success: false,
        message: "Network error",
      };
    }
  }

  // Register user
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    this.setState({ isLoading: true });

    try {
      const response = await apiService.register({ username, email, password });

      if (response.ok && response.data.token) {
        CookieService.setAuthToken(response.data.token);

        this.setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        this.setState({ isLoading: false });
        return {
          success: false,
          message: response.message || "Registration failed",
        };
      }
    } catch (error) {
      this.setState({ isLoading: false });
      return {
        success: false,
        message: "Network error",
      };
    }
  }

  // Logout user
  logout() {
    CookieService.removeAuthStatus();
    CookieService.removeAuthToken();
    this.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.state.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  // Check if auth is loading
  isLoading(): boolean {
    return this.state.isLoading;
  }

  // Set user data (for server-side authentication)
  setUser(user: User) {
    this.setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }
}

export const authService = new AuthService();
