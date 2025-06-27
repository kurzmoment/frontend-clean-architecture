import React from "react";
import {
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate,
} from "react-router";
import { apiClient } from "../infrastructure/api/client";
import type { UserCredentials } from "../domain/entities/User";

export function meta() {
  return [
    { title: "Login - Project Manager" },
    { name: "description", content: "Sign in to your account" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from") || "/dashboard";

  // Check if user is already authenticated by checking for authToken cookie
  const cookieHeader = request.headers.get("Cookie");
  if (cookieHeader && cookieHeader.includes("authToken=")) {
    try {
      const response = await apiClient.get<{ user: any }>("/auth/me");
      if (response.ok) {
        return redirect(from);
      }
    } catch (error) {
      // User is not authenticated, continue to login page
    }
  }

  return { from };
}

export default function Login() {
  const loaderData = useLoaderData() as { from: string } | undefined;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  console.log("Login component rendered", { loaderData, isSubmitting });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Form submitted:", {
      email,
      password: password ? "***" : "empty",
    });

    if (!email || !password) {
      setError("Email and password are required");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Making login request to backend...");
      const response = await apiClient.post<{
        message: string;
        token: string;
        user: any;
      }>("/auth/login", { email, password });

      console.log("Login response:", response);

      if (response.ok) {
        console.log("Login successful, redirecting...");
        setSuccess(true);
        const from = loaderData?.from || "/dashboard";

        // Wait a moment for cookies to be set, then redirect
        setTimeout(() => {
          console.log("Redirecting to:", from);
          navigate(from);
        }, 500);
      } else {
        console.log("Login failed:", response.data);
        setError(
          (response.data as { message: string }).message || "Login failed"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestClick = async () => {
    console.log("Test button clicked");
    try {
      const response = await apiClient.post("/auth/login", {
        email: "admin@admin.cz",
        password: "password123",
      });
      console.log("Test login response:", response);
      if (response.ok) {
        alert("Test login successful! Check console for details.");
      } else {
        const errorMessage =
          (response.data as { message?: string })?.message || "Unknown error";
        alert("Test login failed: " + errorMessage);
      }
    } catch (error) {
      console.error("Test login error:", error);
      alert("Test login error: " + error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </a>
          </p>
        </div>

        {/* Debug info */}
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Debug Info:</strong> Check browser console for detailed logs
          </p>
          <div className="mt-2 space-y-2">
            <button
              onClick={handleTestClick}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm mr-2"
            >
              Test API Connection
            </button>
            <button
              onClick={() => {
                console.log("Manual redirect clicked");
                navigate("/dashboard");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Manual Redirect to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">
              Login successful! Redirecting...
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                defaultValue="admin@admin.cz"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                defaultValue="password123"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
