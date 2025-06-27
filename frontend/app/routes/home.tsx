import React from "react";
import { redirect } from "react-router";
import HomePage from "../presentation/pages/HomePage";

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
  return <HomePage />;
}
