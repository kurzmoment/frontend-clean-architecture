import React, { useState, useMemo } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
  redirect,
  useParams,
} from "react-router";
import { useAuthenticate } from "../presentation/hooks/use-authenticate";
import { useUserStorage } from "../presentation/hooks/use-user-storage";
import { useNotifier } from "../presentation/hooks/use-notifier";
import ProjectForm from "../presentation/components/ProjectForm";
import type { Project, Confident, Tag } from "../shared-kernel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Edit,
  Trash,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  FileText,
} from "lucide-react";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../shared-kernel";
import {
  getServerUser,
  isServerAuthenticated,
} from "../infrastructure/auth/server-auth";
import { serverQueryFunctions } from "../infrastructure/query/queries";
import {
  useProjects,
  useConfidents,
  useTags,
} from "../infrastructure/query/queries";
import {
  useUpdateProject,
  useDeleteProject,
} from "../infrastructure/query/mutations";

export async function loader({ request, params }: LoaderFunctionArgs) {
  // Check authentication on server
  if (!isServerAuthenticated(request)) {
    throw redirect("/login");
  }

  const user = getServerUser(request);
  if (!user) {
    throw redirect("/login");
  }

  const projectId = params.projectId;
  if (!projectId) {
    throw redirect("/projects");
  }

  // Pre-fetch data for SSR
  try {
    const [projects, confidents, tags] = await Promise.all([
      serverQueryFunctions.projects(request),
      serverQueryFunctions.confidents(request),
      serverQueryFunctions.tags(request),
    ]);

    const project = projects.find((p) => p.id === parseInt(projectId));
    if (!project) {
      throw new Response("Project not found", { status: 404 });
    }

    return { project, confidents, tags, user };
  } catch (error) {
    console.error("Failed to load project in loader:", error);
    if (error instanceof Response) throw error;
    throw new Response("Failed to load project", { status: 500 });
  }
}

export default function ProjectDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  const {
    project: initialProject,
    confidents: initialConfidents,
    tags: initialTags,
    user: serverUser,
  } = loaderData;
  const params = useParams();
  const projectId = params.projectId;

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { logout } = useAuthenticate();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // TanStack Query hooks
  const { data: projects = [initialProject], isLoading: projectsLoading } =
    useProjects();
  const { data: confidents = initialConfidents, isLoading: confidentsLoading } =
    useConfidents();
  const { data: tags = initialTags, isLoading: tagsLoading } = useTags();

  // Mutation hooks
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Use server user or fallback to client user
  const user = useMemo(() => {
    return serverUser || userStorage.getUser();
  }, [serverUser, userStorage]);

  // Find current project
  const project = useMemo(() => {
    return projects.find((p) => p.id === parseInt(projectId!));
  }, [projects, projectId]);

  const isLoading = projectsLoading || confidentsLoading || tagsLoading;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProjectForm = async (
    data: CreateProjectRequest | UpdateProjectRequest,
    id?: number
  ) => {
    try {
      if (id) {
        await updateProjectMutation.mutateAsync({
          id,
          data: {
            name: data.name!,
            description: data.description,
          },
        });
        notifier.success("Project updated successfully!");
        setEditingProject(null);
      }
      setShowProjectForm(false);
    } catch (error) {
      console.error("Project operation failed:", error);
      notifier.error("Failed to save project");
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProjectMutation.mutateAsync(id);
      notifier.success("Project deleted successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
      notifier.error("Failed to delete project");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/projects")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <p className="text-muted-foreground">Project Details</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingProject(project);
                  setShowProjectForm(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
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
        <AnimatePresence>
          {showProjectForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6"
            >
              <ProjectForm
                onSubmit={handleProjectForm}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  {project.description && (
                    <p className="text-muted-foreground mt-2">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created:{" "}
                    {new Date(project.created_at || "").toLocaleDateString()}
                  </span>
                </div>

                {project.updated_at &&
                  project.updated_at !== project.created_at && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Updated:{" "}
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Related Confidents */}
            {project.confidents && project.confidents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Related Confidents ({project.confidents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.confidents.map((confident) => (
                      <div key={confident.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold">{confident.name}</h4>
                        {confident.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Mail className="h-3 w-3" />
                            <span>{confident.email}</span>
                          </div>
                        )}
                        {confident.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-3 w-3" />
                            <span>{confident.phone}</span>
                          </div>
                        )}
                        {confident.company && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Building className="h-3 w-3" />
                            <span>{confident.company}</span>
                          </div>
                        )}
                        {confident.position && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Briefcase className="h-3 w-3" />
                            <span>{confident.position}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Tags */}
            {project.tags && project.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Tags ({project.tags.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        style={{ backgroundColor: tag.color || undefined }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => {
                    setEditingProject(project);
                    setShowProjectForm(true);
                  }}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProject(project.id)}
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidents:</span>
                  <span className="font-semibold">
                    {project.confidents?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tags:</span>
                  <span className="font-semibold">
                    {project.tags?.length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
