import React from "react";
import { Link, useActionData, useNavigation, Form } from "react-router";
import { loginAction } from "../lib/auth-actions";
import { requireGuest } from "../lib/auth-loader";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export async function loader() {
  return requireGuest();
}

export async function action({ request }: { request: Request }) {
  return loginAction({ request } as any);
}

export default function LoginPage() {
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {actionData.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email address</label>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
