import React, { useState, useMemo } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { useAuthenticate } from "../presentation/hooks/use-authenticate";
import { useUserStorage } from "../presentation/hooks/use-user-storage";
import { useNotifier } from "../presentation/hooks/use-notifier";
import ProjectForm from "../presentation/components/ProjectForm";
import ConfidentForm from "../presentation/components/ConfidentForm";
import TagForm from "../presentation/components/TagForm";
import type { Project, Confident, Tag } from "../shared-kernel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { AnimatePresence, motion } from "motion/react";
import { Pencil, Trash } from "lucide-react";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateConfidentRequest,
  UpdateConfidentRequest,
  CreateTagRequest,
  UpdateTagRequest,
} from "../shared-kernel";
import ProjectCard from "../presentation/components/ProjectCard";
import ConfidentCard from "../presentation/components/ConfidentCard";
import TagCard from "../presentation/components/TagCard";
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
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useCreateConfident,
  useUpdateConfident,
  useDeleteConfident,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "../infrastructure/query/mutations";

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
    const [projects, confidents, tags] = await Promise.all([
      serverQueryFunctions.projects(request),
      serverQueryFunctions.confidents(request),
      serverQueryFunctions.tags(request),
    ]);

    return {
      projects,
      confidents,
      tags,
      user,
    };
  } catch (error) {
    console.error("Failed to load data in loader:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
}

export default function DashboardPage() {
  const loaderData = useLoaderData<typeof loader>();
  const {
    projects: initialProjects,
    confidents: initialConfidents,
    tags: initialTags,
    user: serverUser,
  } = loaderData;

  const [activeTab, setActiveTab] = useState<
    "projects" | "confidents" | "tags"
  >("projects");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showConfidentForm, setShowConfidentForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingConfident, setEditingConfident] = useState<Confident | null>(
    null
  );
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const { logout } = useAuthenticate();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // TanStack Query hooks
  const { data: projects = initialProjects, isLoading: projectsLoading } =
    useProjects();
  const { data: confidents = initialConfidents, isLoading: confidentsLoading } =
    useConfidents();
  const { data: tags = initialTags, isLoading: tagsLoading } = useTags();

  // Mutation hooks
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const createConfidentMutation = useCreateConfident();
  const updateConfidentMutation = useUpdateConfident();
  const deleteConfidentMutation = useDeleteConfident();
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  // Use server user or fallback to client user
  const user = useMemo(() => {
    return serverUser || userStorage.getUser();
  }, [serverUser, userStorage]);

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
        // Update project using TanStack Query mutation
        await updateProjectMutation.mutateAsync({
          id,
          data: {
            name: data.name!,
            description: data.description,
          },
        });

        // Get current project to see existing relationships
        const currentProject = projects.find((p) => p.id === id);
        const currentConfidentIds =
          currentProject?.confidents?.map((c) => c.id) || [];
        const currentTagIds = currentProject?.tags?.map((t) => t.id) || [];

        const newConfidentIds = data.confident_ids || [];
        const newTagIds = data.tag_ids || [];

        // Only update confidents if the selection has changed
        if (
          JSON.stringify(currentConfidentIds.sort()) !==
          JSON.stringify(newConfidentIds.sort())
        ) {
          // Remove confidents that are no longer selected
          for (const confidentId of currentConfidentIds) {
            if (!newConfidentIds.includes(confidentId)) {
              try {
                await fetch(`/api/projects/${id}/confidents/${confidentId}`, {
                  method: "DELETE",
                });
              } catch (error) {
                console.error(
                  `Failed to remove confident ${confidentId}:`,
                  error
                );
              }
            }
          }

          // Add new confidents
          for (const confidentId of newConfidentIds) {
            if (!currentConfidentIds.includes(confidentId)) {
              try {
                await fetch(`/api/projects/${id}/confidents`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ confident_id: confidentId }),
                });
              } catch (error) {
                console.error(`Failed to add confident ${confidentId}:`, error);
              }
            }
          }
        }

        // Only update tags if the selection has changed
        if (
          JSON.stringify(currentTagIds.sort()) !==
          JSON.stringify(newTagIds.sort())
        ) {
          // Remove tags that are no longer selected
          for (const tagId of currentTagIds) {
            if (!newTagIds.includes(tagId)) {
              try {
                await fetch(`/api/projects/${id}/tags/${tagId}`, {
                  method: "DELETE",
                });
              } catch (error) {
                console.error(`Failed to remove tag ${tagId}:`, error);
              }
            }
          }

          // Add new tags
          for (const tagId of newTagIds) {
            if (!currentTagIds.includes(tagId)) {
              try {
                await fetch(`/api/projects/${id}/tags`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ tag_id: tagId }),
                });
              } catch (error) {
                console.error(`Failed to add tag ${tagId}:`, error);
              }
            }
          }
        }

        notifier.success("Project updated successfully!");
        setEditingProject(null);
      } else {
        // Create project using TanStack Query mutation
        await createProjectMutation.mutateAsync({
          name: data.name!,
          description: data.description,
        });

        notifier.success("Project created successfully!");
      }
      setShowProjectForm(false);
    } catch (error) {
      console.error("Project operation failed:", error);
      notifier.error("Failed to save project");
    }
  };

  const handleConfidentForm = async (
    data: CreateConfidentRequest | UpdateConfidentRequest,
    id?: number
  ) => {
    try {
      if (id) {
        // Update confident using TanStack Query mutation
        await updateConfidentMutation.mutateAsync({
          id,
          data: data as UpdateConfidentRequest,
        });

        notifier.success("Confident updated successfully!");
        setEditingConfident(null);
      } else {
        // Create confident using TanStack Query mutation
        await createConfidentMutation.mutateAsync(
          data as CreateConfidentRequest
        );

        notifier.success("Confident created successfully!");
      }
      setShowConfidentForm(false);
    } catch (error) {
      console.error("Confident operation failed:", error);
      notifier.error("Failed to save confident");
    }
  };

  const handleTagForm = async (
    data: CreateTagRequest | UpdateTagRequest,
    id?: number
  ) => {
    try {
      if (id) {
        // Update tag using TanStack Query mutation
        await updateTagMutation.mutateAsync({
          id,
          data: data as UpdateTagRequest,
        });

        notifier.success("Tag updated successfully!");
        setEditingTag(null);
      } else {
        // Create tag using TanStack Query mutation
        await createTagMutation.mutateAsync(data as CreateTagRequest);

        notifier.success("Tag created successfully!");
      }
      setShowTagForm(false);
    } catch (error) {
      console.error("Tag operation failed:", error);
      notifier.error("Failed to save tag");
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProjectMutation.mutateAsync(id);
      notifier.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete project:", error);
      notifier.error("Failed to delete project");
    }
  };

  const handleDeleteConfident = async (id: number) => {
    try {
      await deleteConfidentMutation.mutateAsync(id);
      notifier.success("Confident deleted successfully!");
    } catch (error) {
      console.error("Failed to delete confident:", error);
      notifier.error("Failed to delete confident");
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagMutation.mutateAsync(id);
      notifier.success("Tag deleted successfully!");
    } catch (error) {
      console.error("Failed to delete tag:", error);
      notifier.error("Failed to delete tag");
    }
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
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
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.username}
              </p>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="projects">
              Projects ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="confidents">
              Confidents ({confidents.length})
            </TabsTrigger>
            <TabsTrigger value="tags">Tags ({tags.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <Card className="mb-6">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Projects</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/projects")}
                    >
                      View All
                    </Button>
                    <Button onClick={() => setShowProjectForm(true)}>
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
                  {projects.length === 0 ? (
                    <p className="text-muted-foreground">
                      No projects found. Create your first project to get
                      started.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      <AnimatePresence>
                        {projects.map((project) => (
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
                              onDelete={handleDeleteProject}
                              onView={(p) => navigate(`/projects/${p.id}`)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="confidents">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <Card className="mb-6">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Confidents</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/confidents")}
                    >
                      View All
                    </Button>
                    <Button onClick={() => setShowConfidentForm(true)}>
                      Add Confident
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {showConfidentForm && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <ConfidentForm
                          onSubmit={handleConfidentForm}
                          onCancel={() => {
                            setShowConfidentForm(false);
                            setEditingConfident(null);
                          }}
                          initialValue={editingConfident || undefined}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {confidents.length === 0 ? (
                    <p className="text-muted-foreground">
                      No confidents found. Add your first confident to get
                      started.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      <AnimatePresence>
                        {confidents.map((confident) => (
                          <motion.div
                            key={confident.id}
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
                            <ConfidentCard
                              confident={confident}
                              onEdit={(c) => {
                                setEditingConfident(c);
                                setShowConfidentForm(true);
                              }}
                              onDelete={handleDeleteConfident}
                              onView={(c) => navigate(`/confidents/${c.id}`)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="tags">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <Card className="mb-6">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Tags</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate("/tags")}>
                      View All
                    </Button>
                    <Button onClick={() => setShowTagForm(true)}>
                      Add Tag
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {showTagForm && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <TagForm
                          onSubmit={handleTagForm}
                          onCancel={() => {
                            setShowTagForm(false);
                            setEditingTag(null);
                          }}
                          initialValue={editingTag || undefined}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {tags.length === 0 ? (
                    <p className="text-muted-foreground">
                      No tags found. Create your first tag to get started.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <AnimatePresence>
                        {tags.map((tag) => (
                          <motion.div
                            key={tag.id}
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
                            <TagCard
                              tag={tag}
                              onEdit={(t) => {
                                setEditingTag(t);
                                setShowTagForm(true);
                              }}
                              onDelete={handleDeleteTag}
                              onView={(t) => navigate(`/tags/${t.id}`)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
