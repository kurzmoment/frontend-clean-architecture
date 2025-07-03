import React, { useState, useMemo } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { authService } from "../services";
import { projectQueryFunctions } from "../infrastructure/query/projects/queries";
import ProjectForm from "../presentation/components/ProjectForm";
import type { Project, Confident, Tag } from "../services";
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
import type { CreateProjectData, UpdateProjectData } from "../services";
import {
  useProjects,
  useConfidents,
  useTags,
  useProject,
  tagQueryFunctions,
  confidentQueryFunctions,
} from "../infrastructure/query";
import { useUpdateProject, useDeleteProject } from "../infrastructure/query";
import { requireAuth } from "../lib/auth-loader";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const projectId = parseInt(params.projectId!);

  if (isNaN(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await projectQueryFunctions.project(projectId, request);
  if (!project) {
    throw new Error("Project not found");
  }

  console.log("project", project);

  const confidents = await confidentQueryFunctions.confidents(request);
  if (!confidents) {
    throw new Error("Confidents not found");
  }

  console.log("");
  const tags = await tagQueryFunctions.tags(request);
  if (!tags) {
    throw new Error("Tags not found");
  }

  return { user, project, confidents, tags };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId;
  const {
    user,
    project: initialProject,
    confidents: initialConfidents,
    tags: initialTags,
  } = useLoaderData<typeof loader>();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const navigate = useNavigate();

  // TanStack Query hooks
  const { data: currentProject = initialProject, isLoading: projectLoading } =
    useProject(parseInt(projectId!), initialProject);
  const { data: confidents = [], isLoading: confidentsLoading } =
    useConfidents();
  const { data: tags = [], isLoading: tagsLoading } = useTags();

  // Mutation hooks
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const isLoading = projectLoading || confidentsLoading || tagsLoading;

  const handleLogout = async () => {
    authService.logout();
    navigate("/login");
  };

  const handleUpdateProject = async (id: number, data: UpdateProjectData) => {
    try {
      await updateProjectMutation.mutateAsync({ id, data });
      setEditingProject(null);
      setShowProjectForm(false);
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProjectMutation.mutateAsync(id);
      navigate("/projects");
    } catch (error) {
      // Handle error silently or show user-friendly message
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

  if (!currentProject) {
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
              <Button variant="outline" onClick={() => navigate("/projects")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {currentProject.name}
                </h1>
                <p className="text-muted-foreground">
                  Project details and information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.username || "User"}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {currentProject.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {/* Confidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Confidents ({currentProject.confidents?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentProject.confidents &&
                currentProject.confidents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentProject.confidents.map((confident) => (
                      <div
                        key={confident.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {confident.name}
                            </h4>
                            {confident.company && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {confident.company}
                              </p>
                            )}
                            {confident.position && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {confident.position}
                              </p>
                            )}
                            {confident.email && (
                              <p className="text-sm text-primary flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {confident.email}
                              </p>
                            )}
                            {confident.phone && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {confident.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No confidents assigned to this project.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags ({currentProject.tags?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {currentProject.tags && currentProject.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentProject.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        style={{
                          backgroundColor: tag.color,
                          color: "#fff",
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No tags assigned to this project.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => {
                    setEditingProject(currentProject);
                    setShowProjectForm(true);
                  }}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProject(currentProject.id)}
                  disabled={deleteProjectMutation.isPending}
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {deleteProjectMutation.isPending
                    ? "Deleting..."
                    : "Delete Project"}
                </Button>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {new Date(
                      currentProject.created_at || ""
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>
                    {new Date(
                      currentProject.updated_at || ""
                    ).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Project Form Modal */}
        <AnimatePresence>
          {showProjectForm && editingProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4"
              >
                <ProjectForm
                  project={editingProject}
                  confidents={confidents}
                  tags={tags}
                  onSubmit={(data) =>
                    handleUpdateProject(editingProject.id, data)
                  }
                  onCancel={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                  }}
                  isLoading={updateProjectMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
