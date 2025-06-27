import React from "react";
import { redirect, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { apiClient } from "../infrastructure/api/client";
import LoginPage from "../presentation/pages/LoginPage";

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
      const response = await apiClient.get<{ user: any }>("/auth/me", request);
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

  return <LoginPage from={loaderData?.from} />;
}
