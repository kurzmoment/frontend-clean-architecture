import React from "react";
import {
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useActionData,
} from "react-router";
import { apiClient } from "../infrastructure/api/client";
import RegisterPage from "../presentation/pages/RegisterPage";

export function meta() {
  return [
    { title: "Register - Project Manager" },
    { name: "description", content: "Create your account" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Check if user is already authenticated
  try {
    const response = await apiClient.get("/auth/me", request);
    if (response.ok) {
      return redirect("/dashboard");
    }
  } catch (error) {
    // User is not authenticated, continue to register page
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const response = await apiClient.post<{ message: string }>(
      "/auth/register",
      { username, email, password },
      request
    );
    if (response.ok) {
      return redirect("/dashboard");
    } else {
      return {
        error:
          (response.data as { message: string }).message ||
          "Registration failed",
      };
    }
  } catch (error) {
    return { error: "Registration failed. Please try again." };
  }
}

export default function Register() {
  const actionData = useActionData() as { error?: string } | undefined;

  return <RegisterPage actionData={actionData} />;
}
