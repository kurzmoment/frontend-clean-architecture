import React, { useState, useMemo } from "react";
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from "react-router";
import { authService } from "../services";
import { projectQueryFunctions } from "../infrastructure/query/projects/queries";
import { confidentQueryFunctions } from "../infrastructure/query/confidents/queries";
import { tagQueryFunctions } from "../infrastructure/query/tags/queries";
import ProjectForm from "../presentation/components/ProjectForm";
import type { Project } from "../services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import type { CreateProjectData, UpdateProjectData } from "../services";
import ProjectCard from "../presentation/components/ProjectCard";
import {
  useProjects,
  useConfidents,
  useTags,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../infrastructure/query";
import { requireAuth } from "@/lib/auth-loader";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);

  // Use the unified query functions to fetch data
  const projects = await projectQueryFunctions.projects(request);
  const confidents = await confidentQueryFunctions.confidents(request);
  const tags = await tagQueryFunctions.tags(request);

  return { user, projects, confidents, tags };
}

export default function ProjectsPage() {
  const { user, projects: initialProjects } = useLoaderData<typeof loader>();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const revalidator = useRevalidator();

  // TanStack Query hooks
  const { data: projects = initialProjects, isLoading: projectsLoading } =
    useProjects(initialProjects);
  const { data: confidents = [], isLoading: confidentsLoading } =
    useConfidents();
  const { data: tags = [], isLoading: tagsLoading } = useTags();

  // Mutation hooks
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const isLoading = projectsLoading || confidentsLoading || tagsLoading;

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    return projects.filter(
      (project: Project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleLogout = async () => {
    authService.logout();
    navigate("/login");
  };

  const handleViewProject = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleCreateProject = async (
    data: CreateProjectData | UpdateProjectData
  ) => {
    try {
      // Type guard to ensure we have the required fields for creation
      if (!data.name) {
        throw new Error("Project name is required");
      }

      const createData: CreateProjectData = {
        name: data.name,
        description: data.description,
        confident_ids: data.confident_ids,
        tag_ids: data.tag_ids,
      };

      await createProjectMutation.mutateAsync(createData);
      setShowProjectForm(false);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleUpdateProject = async (
    id: number,
    data: CreateProjectData | UpdateProjectData
  ) => {
    try {
      const updateData: UpdateProjectData = {
        name: data.name,
        description: data.description,
        confident_ids: data.confident_ids,
        tag_ids: data.tag_ids,
      };

      await updateProjectMutation.mutateAsync({ id, data: updateData });
      setEditingProject(null);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProjectMutation.mutateAsync(id);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
    }
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground">
                Manage your projects and track progress
              </p>
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
        {/* Search and Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={() => setShowProjectForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Project Form Modal */}
        <AnimatePresence>
          {showProjectForm && (
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
                  confidents={confidents}
                  tags={tags}
                  onSubmit={handleCreateProject}
                  onCancel={() => setShowProjectForm(false)}
                  isLoading={createProjectMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Project Form Modal */}
        <AnimatePresence>
          {editingProject && (
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
                  onCancel={() => setEditingProject(null)}
                  isLoading={updateProjectMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {searchTerm
                ? "No projects found matching your search."
                : "No projects yet."}
            </div>
            {!searchTerm && (
              <Button onClick={() => setShowProjectForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={() => handleViewProject(project)}
                onEdit={() => setEditingProject(project)}
                onDelete={() => handleDeleteProject(project.id)}
                isLoading={deleteProjectMutation.isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
