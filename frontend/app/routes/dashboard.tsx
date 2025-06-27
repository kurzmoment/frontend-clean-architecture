import React from "react";
import {
  useNavigate,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { apiClient } from "../infrastructure/api/client";
import type { Project, CreateProjectRequest } from "../domain/entities/Project";

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

type TabType = "projects" | "confidents" | "tags";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    projects: initialProjects,
    confidents: initialConfidents,
    tags: initialTags,
  } = useLoaderData<DashboardData>();

  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [confidents, setConfidents] =
    React.useState<Confident[]>(initialConfidents);
  const [tags, setTags] = React.useState<Tag[]>(initialTags);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = React.useState<TabType>("projects");
  const [editingProject, setEditingProject] = React.useState<Project | null>(
    null
  );
  // Add state for form visibility
  const [showProjectForm, setShowProjectForm] = React.useState(false);
  const [showConfidentForm, setShowConfidentForm] = React.useState(false);
  const [showTagForm, setShowTagForm] = React.useState(false);

  const handleCreateProject = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget; // Store reference to form element
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      setActionMessage({ type: "error", message: "Project name is required" });
      return;
    }

    try {
      console.log("Creating project with:", { name, description });
      const response = await apiClient.post<{
        message: string;
        project: Project;
      }>("/projects", { name, description });

      console.log("Project creation response:", response);

      if (response.ok) {
        console.log("Project created successfully");
        setActionMessage({
          type: "success",
          message: "Project created successfully",
        });
        // Reload projects
        const projectsResponse = await apiClient.get<Project[]>("/projects");
        if (projectsResponse.ok) {
          setProjects(projectsResponse.data);
        }
        // Reset form using stored reference
        if (form) {
          form.reset();
        }
        // Hide form
        setShowProjectForm(false);
      } else {
        console.error("Project creation failed:", response);
        setActionMessage({
          type: "error",
          message:
            (response.data as { message: string }).message ||
            "Failed to create project",
        });
      }
    } catch (error) {
      console.error("Project creation error:", error);
      setActionMessage({ type: "error", message: "Failed to create project" });
    }
  };

  const handleCreateConfident = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget; // Store reference to form element
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      setActionMessage({
        type: "error",
        message: "Confident name is required",
      });
      return;
    }

    try {
      const response = await apiClient.post<{
        message: string;
        confident: Confident;
      }>("/confidents", { name, description });

      if (response.ok) {
        setActionMessage({
          type: "success",
          message: "Confident created successfully",
        });
        // Reload confidents
        const confidentsResponse = await apiClient.get<Confident[]>(
          "/confidents"
        );
        if (confidentsResponse.ok) {
          setConfidents(confidentsResponse.data);
        }
        // Reset form using stored reference
        if (form) {
          form.reset();
        }
        // Hide form
        setShowConfidentForm(false);
      } else {
        setActionMessage({
          type: "error",
          message:
            (response.data as { message: string }).message ||
            "Failed to create confident",
        });
      }
    } catch (error) {
      setActionMessage({
        type: "error",
        message: "Failed to create confident",
      });
    }
  };

  const handleCreateTag = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget; // Store reference to form element
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;

    if (!name) {
      setActionMessage({ type: "error", message: "Tag name is required" });
      return;
    }

    try {
      const response = await apiClient.post<{
        message: string;
        tag: Tag;
      }>("/tags", { name, color: color || "#007bff" });

      if (response.ok) {
        setActionMessage({
          type: "success",
          message: "Tag created successfully",
        });
        // Reload tags
        const tagsResponse = await apiClient.get<Tag[]>("/tags");
        if (tagsResponse.ok) {
          setTags(tagsResponse.data);
        }
        // Reset form using stored reference
        if (form) {
          form.reset();
        }
        // Hide form
        setShowTagForm(false);
      } else {
        setActionMessage({
          type: "error",
          message:
            (response.data as { message: string }).message ||
            "Failed to create tag",
        });
      }
    } catch (error) {
      setActionMessage({ type: "error", message: "Failed to create tag" });
    }
  };

  const handleAssignConfidentToProject = async (
    projectId: number,
    confidentId: number
  ) => {
    try {
      const response = await apiClient.post(
        `/projects/${projectId}/confidents`,
        { confident_id: confidentId }
      );
      if (response.ok) {
        setActionMessage({
          type: "success",
          message: "Confident assigned to project successfully",
        });
        // Reload projects
        const projectsResponse = await apiClient.get<Project[]>("/projects");
        if (projectsResponse.ok) {
          setProjects(projectsResponse.data);
        }
      } else {
        setActionMessage({
          type: "error",
          message:
            (response.data as { message: string }).message ||
            "Failed to assign confident",
        });
      }
    } catch (error) {
      setActionMessage({
        type: "error",
        message: "Failed to assign confident",
      });
    }
  };

  const handleAssignTagToProject = async (projectId: number, tagId: number) => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/tags`, {
        tag_id: tagId,
      });
      if (response.ok) {
        setActionMessage({
          type: "success",
          message: "Tag assigned to project successfully",
        });
        // Reload projects
        const projectsResponse = await apiClient.get<Project[]>("/projects");
        if (projectsResponse.ok) {
          setProjects(projectsResponse.data);
        }
      } else {
        setActionMessage({
          type: "error",
          message:
            (response.data as { message: string }).message ||
            "Failed to assign tag",
        });
      }
    } catch (error) {
      setActionMessage({ type: "error", message: "Failed to assign tag" });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `/projects/${projectId}`
      );
      if (response.ok) {
        setActionMessage({
          type: "success",
          message: "Project deleted successfully",
        });
        // Reload projects
        const projectsResponse = await apiClient.get<Project[]>("/projects");
        if (projectsResponse.ok) {
          setProjects(projectsResponse.data);
        }
      } else {
        setActionMessage({
          type: "error",
          message:
            (response.data as { message: string }).message ||
            "Failed to delete project",
        });
      }
    } catch (error) {
      setActionMessage({ type: "error", message: "Failed to delete project" });
    }
  };

  const handleDeleteConfident = async (confidentId: string) => {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `/confidents/${confidentId}`
      );
      if (response.ok) {
        setActionMessage({
          type: "success",
          message: "Confident deleted successfully",
        });
        // Reload confidents
        const confidentsResponse = await apiClient.get<Confident[]>(
          "/confidents"
        );
        if (confidentsResponse.ok) {
          setConfidents(confidentsResponse.data);
        }
      } else {
        setActionMessage({
          type: "error",
          message:
            (response.data as { message: string }).message ||
            "Failed to delete confident",
        });
      }
    } catch (error) {
      setActionMessage({
        type: "error",
        message: "Failed to delete confident",
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `/tags/${tagId}`
      );
      if (response.ok) {
        setActionMessage({
          type: "success",
          message: "Tag deleted successfully",
        });
        // Reload tags
        const tagsResponse = await apiClient.get<Tag[]>("/tags");
        if (tagsResponse.ok) {
          setTags(tagsResponse.data);
        }
      } else {
        setActionMessage({
          type: "error",
          message:
            (response.data as { message: string }).message ||
            "Failed to delete tag",
        });
      }
    } catch (error) {
      setActionMessage({ type: "error", message: "Failed to delete tag" });
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Project Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Action Messages */}
          {actionMessage && (
            <div
              className={`mb-4 p-4 rounded-md ${
                actionMessage.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {actionMessage.message}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "projects", name: "Projects", count: projects.length },
                {
                  id: "confidents",
                  name: "Confidents",
                  count: confidents.length,
                },
                { id: "tags", name: "Tags", count: tags.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Projects
                </h2>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Project
                </button>
              </div>

              {/* Create Project Form */}
              {showProjectForm && (
                <form
                  onSubmit={handleCreateProject}
                  className="mb-6 bg-white p-6 rounded-lg shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create New Project
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="projectName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Project Name
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        name="name"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="projectDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        id="projectDescription"
                        name="description"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowProjectForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              )}

              {/* Projects List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {projects.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No projects yet. Create your first project!
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <li key={project.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {project.description}
                              </p>
                            )}
                            {/* Show confidents and tags if they exist */}
                            {((project.confidents &&
                              project.confidents.length > 0) ||
                              (project.tags && project.tags.length > 0)) && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {project.confidents?.map((confident) => (
                                  <span
                                    key={confident.id}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {confident.name}
                                  </span>
                                ))}
                                {project.tags?.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: tag.color + "20",
                                      color: tag.color,
                                    }}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Assignment Controls */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {/* Assign Confident */}
                              {confidents.length > 0 && (
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAssignConfidentToProject(
                                        project.id,
                                        parseInt(e.target.value)
                                      );
                                      e.target.value = "";
                                    }
                                  }}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                  <option value="">+ Add Confident</option>
                                  {confidents.map((confident) => (
                                    <option
                                      key={confident.id}
                                      value={confident.id}
                                    >
                                      {confident.name}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {/* Assign Tag */}
                              {tags.length > 0 && (
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAssignTagToProject(
                                        project.id,
                                        parseInt(e.target.value)
                                      );
                                      e.target.value = "";
                                    }
                                  }}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                  <option value="">+ Add Tag</option>
                                  {tags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                      {tag.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteProject(project.id.toString())
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-4"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Confidents Tab */}
          {activeTab === "confidents" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Confidents
                </h2>
                <button
                  onClick={() => setShowConfidentForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Confident
                </button>
              </div>

              {/* Create Confident Form */}
              {showConfidentForm && (
                <form
                  onSubmit={handleCreateConfident}
                  className="mb-6 bg-white p-6 rounded-lg shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create New Confident
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="confidentName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confident Name
                      </label>
                      <input
                        type="text"
                        id="confidentName"
                        name="name"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="Enter confident name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confidentDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        id="confidentDescription"
                        name="description"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="Enter confident description"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfidentForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Create Confident
                    </button>
                  </div>
                </form>
              )}

              {/* Confidents List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {confidents.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No confidents yet. Create your first confident!
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {confidents.map((confident) => (
                      <li key={confident.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {confident.name}
                            </h3>
                            {confident.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {confident.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteConfident(confident.id.toString())
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === "tags" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Tags</h2>
                <button
                  onClick={() => setShowTagForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Tag
                </button>
              </div>

              {/* Create Tag Form */}
              {showTagForm && (
                <form
                  onSubmit={handleCreateTag}
                  className="mb-6 bg-white p-6 rounded-lg shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create New Tag
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="tagName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tag Name
                      </label>
                      <input
                        type="text"
                        id="tagName"
                        name="name"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        placeholder="Enter tag name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="tagColor"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Color
                      </label>
                      <input
                        type="color"
                        id="tagColor"
                        name="color"
                        defaultValue="#007bff"
                        className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTagForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Create Tag
                    </button>
                  </div>
                </form>
              )}

              {/* Tags List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {tags.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No tags yet. Create your first tag!
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {tags.map((tag) => (
                      <li key={tag.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            ></div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {tag.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => handleDeleteTag(tag.id.toString())}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
