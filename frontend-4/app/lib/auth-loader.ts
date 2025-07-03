import { redirect, type LoaderFunctionArgs } from "react-router";
import { authService } from "../services";

export async function requireAuth(request: Request) {
  // Check for authentication token in the request (server-side)
  const url = new URL(request.url);
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") ||
    url.searchParams.get("token") ||
    request.headers.get("Cookie")?.match(/authToken=([^;]+)/)?.[1];

  // If we have a token in the request, verify it with the server
  if (token) {
    try {
      const response = await fetch(`${url.origin}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Set the user data in the auth service for client-side use
        authService.setUser(userData.user);
        return userData.user;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  // Initialize auth service if not already done (client-side fallback)
  await authService.initialize();

  if (!authService.isAuthenticated()) {
    throw redirect("/login");
  }

  return authService.getCurrentUser();
}

export async function requireGuest() {
  // Initialize auth service if not already done
  await authService.initialize();

  if (authService.isAuthenticated()) {
    throw redirect("/dashboard");
  }

  return null;
}

export async function getAuthUser() {
  // Initialize auth service if not already done
  await authService.initialize();

  return {
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: authService.isLoading(),
  };
}
