import React, { useState, useMemo } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useActionData,
  useNavigation,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
  useRevalidator,
} from "react-router";
import { useAuthenticate } from "../presentation/hooks/use-authenticate";
import { useUserStorage } from "../presentation/hooks/use-user-storage";
import { useNotifier } from "../presentation/hooks/use-notifier";
import ProjectForm from "../presentation/components/ProjectForm";
import type { Project } from "../shared-kernel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../shared-kernel";
import ProjectCard from "../presentation/components/ProjectCard";
import {
  getServerUser,
  isServerAuthenticated,
} from "../infrastructure/auth/server-auth";
import {
  serverQueryFunctions,
  serverMutationFunctions,
} from "../infrastructure/query";
import { useProjects, useConfidents, useTags } from "../infrastructure/query";

export async function loader({ request }: LoaderFunctionArgs) {
  // Check authentication on server
  if (!isServerAuthenticated(request)) {
    throw redirect("/login");
  }

  const user = getServerUser(request);
  if (!user) {
    throw redirect("/login");
  }

  // Pre-fetch data for SSR
  try {
    const projects = await serverQueryFunctions.projects(request);
    return { projects, user };
  } catch (error) {
    console.error("Failed to load projects in loader:", error);
    throw new Response("Failed to load projects", { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  // Check authentication on server
  if (!isServerAuthenticated(request)) {
    throw redirect("/login");
  }

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    switch (intent) {
      case "create":
        await serverMutationFunctions.createProjectFromFormData(
          formData,
          request
        );

        return { success: true, message: "Project created successfully" };

      case "update":
        const updateId = parseInt(formData.get("id") as string);
        if (isNaN(updateId)) {
          throw new Error("Invalid project ID");
        }
        await serverMutationFunctions.updateProjectFromFormData(
          formData,
          updateId,
          request
        );

        return { success: true, message: "Project updated successfully" };

      case "delete":
        const deleteId = parseInt(formData.get("id") as string);
        if (isNaN(deleteId)) {
          throw new Error("Invalid project ID");
        }
        await serverMutationFunctions.deleteProject(request, deleteId);
        return { success: true, message: "Project deleted successfully" };

      default:
        throw new Error("Invalid action intent");
    }
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export default function ProjectsPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const { projects: initialProjects, user: serverUser } = loaderData;

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { logout } = useAuthenticate();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // Show action result if available
  React.useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        notifier.success(actionData.message);
        // Close form on success
        setShowProjectForm(false);
        setEditingProject(null);
        revalidator.revalidate();
      } else {
        notifier.error(actionData.message);
      }
    }
  }, [actionData, notifier]);

  // TanStack Query hooks
  const { data: projects = initialProjects, isLoading: projectsLoading } =
    useProjects();
  const { data: confidents = [], isLoading: confidentsLoading } =
    useConfidents();
  const { data: tags = [], isLoading: tagsLoading } = useTags();

  const isLoading = projectsLoading || confidentsLoading || tagsLoading;

  // Use server user or fallback to client user
  const user = useMemo(() => {
    return serverUser || userStorage.getUser();
  }, [serverUser, userStorage]);

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleViewProject = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  console.log("projects", projects);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground">
                Manage your projects and track progress
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={() => setShowProjectForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {showProjectForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-6"
                >
                  <ProjectForm
                    onCancel={() => {
                      setShowProjectForm(false);
                      setEditingProject(null);
                    }}
                    confidents={confidents}
                    tags={tags}
                    initialValue={editingProject || undefined}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm
                    ? "No projects found matching your search."
                    : "No projects found. Create your first project to get started."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowProjectForm(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <ProjectCard
                        project={project}
                        onEdit={(p) => {
                          setEditingProject(p);
                          setShowProjectForm(true);
                        }}
                        onView={handleViewProject}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
