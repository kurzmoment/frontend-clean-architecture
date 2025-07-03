import { redirect, type ActionFunctionArgs } from "react-router";
import { authService } from "../services";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const result = await authService.login(email, password);

    if (result.success) {
      throw redirect("/dashboard");
    } else {
      return { error: result.message || "Login failed" };
    }
  } catch (error) {
    if (error instanceof Response) {
      throw error; // Re-throw redirects
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function registerAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || !email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const result = await authService.register(username, email, password);

    if (result.success) {
      throw redirect("/dashboard");
    } else {
      return { error: result.message || "Registration failed" };
    }
  } catch (error) {
    if (error instanceof Response) {
      throw error; // Re-throw redirects
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function logoutAction({ request }: ActionFunctionArgs) {
  authService.logout();
  throw redirect("/login");
}
