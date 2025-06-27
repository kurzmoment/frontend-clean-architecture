import React from "react";
import { redirect } from "react-router";

export function meta() {
  return [
    { title: "Project Manager" },
    { name: "description", content: "Welcome to Project Manager!" },
  ];
}

export async function loader() {
  return redirect("/login");
}

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
