import React from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { apiClient } from "../infrastructure/api/client";
import type { Project } from "../domain/entities/Project";
import DashboardPage from "../presentation/pages/DashboardPage";

export function meta() {
  return [
    { title: "Dashboard - Project Manager" },
    { name: "description", content: "Manage your projects" },
  ];
}

interface Confident {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at: string;
}

interface DashboardData {
  user: any;
  projects: Project[];
  confidents: Confident[];
  tags: Tag[];
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<DashboardData> {
  try {
    console.log("Loading dashboard data on server...");

    // Check authentication
    const authResponse = await apiClient.get<{ user: any }>(
      "/auth/me",
      request
    );
    if (!authResponse.ok) {
      throw new Response("Authentication failed", { status: 401 });
    }

    // Load all data in parallel
    const [projectsResponse, confidentsResponse, tagsResponse] =
      await Promise.all([
        apiClient.get<Project[]>("/projects", request),
        apiClient.get<Confident[]>("/confidents", request),
        apiClient.get<Tag[]>("/tags", request),
      ]);

    return {
      user: authResponse.data.user,
      projects: projectsResponse.ok ? projectsResponse.data : [],
      confidents: confidentsResponse.ok ? confidentsResponse.data : [],
      tags: tagsResponse.ok ? tagsResponse.data : [],
    };
  } catch (error) {
    console.error("Dashboard loader error:", error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Failed to load dashboard data", { status: 500 });
  }
}

export default function Dashboard() {
  const { user, projects, confidents, tags } = useLoaderData<DashboardData>();

  return (
    <DashboardPage
      user={user}
      projects={projects}
      confidents={confidents}
      tags={tags}
    />
  );
}
