import React, { useState, useEffect, useMemo } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
import { useAuthenticate } from "../presentation/hooks/use-authenticate";
import { useProjects } from "../presentation/hooks/use-projects";
import { useConfidents } from "../presentation/hooks/use-confidents";
import { useTags } from "../presentation/hooks/use-tags";
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
import { apiClient } from "../infrastructure/api/api-client";
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

// export async function loader({ request }: LoaderFunctionArgs) {
//   const [projects, confidents, tags] = await Promise.all([
//     apiClient.get<Project[]>("/projects", request),
//     apiClient.get<Confident[]>("/confidents", request),
//     apiClient.get<Tag[]>("/tags", request),
//   ]);

//   return {
//     projects: projects.data,
//     confidents: confidents.data,
//     tags: tags.data,
//   };
// }

export default function DashboardPage() {
  // const loaderData = useLoaderData<typeof loader>();
  // console.log("loaderData", loaderData);

  const [projects, setProjects] = useState<Project[]>([]);
  const [confidents, setConfidents] = useState<Confident[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "projects" | "confidents" | "tags"
  >("projects");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showConfidentForm, setShowConfidentForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingConfident, setEditingConfident] = useState<Confident | null>(
    null
  );
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const { logout } = useAuthenticate();
  const {
    create: createProject,
    update: updateProject,
    delete: deleteProject,
  } = useProjects();
  const {
    create: createConfident,
    update: updateConfident,
    delete: deleteConfident,
  } = useConfidents();
  const { create: createTag, update: updateTag, delete: deleteTag } = useTags();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // Memoize the user to prevent unnecessary re-renders
  const user = useMemo(() => userStorage.getUser(), [userStorage]);

  useEffect(() => {
    // Set isClient to true after component mounts (client-side only)
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only redirect to login on the client side and if user is not authenticated
    if (isClient && !user) {
      navigate("/login");
      return;
    }

    if (!user) {
      return; // Don't load data if no user (will redirect on client)
    }

    const loadData = async () => {
      try {
        // Use fetch to call the resource routes
        const [projectsResponse, confidentsResponse, tagsResponse] =
          await Promise.all([
            fetch("/api/projects"),
            fetch("/api/confidents"),
            fetch("/api/tags"),
          ]);

        if (
          !projectsResponse.ok ||
          !confidentsResponse.ok ||
          !tagsResponse.ok
        ) {
          throw new Error("Failed to load data");
        }

        const [projectsData, confidentsData, tagsData] = await Promise.all([
          projectsResponse.json(),
          confidentsResponse.json(),
          tagsResponse.json(),
        ]);

        setProjects(projectsData);
        setConfidents(confidentsData);
        setTags(tagsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isClient]); // Only depend on user and isClient

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
        // Update project basic info first
        await updateProject(id, {
          name: data.name!,
          description: data.description,
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

        // Refresh projects list
        const projectsResponse = await fetch("/api/projects");
        if (projectsResponse.ok) {
          const updatedProjects = await projectsResponse.json();
          setProjects(updatedProjects);
        }

        notifier.success("Project updated successfully!");
        setEditingProject(null);
      } else {
        // Create project using the hook
        const newProject = await createProject({
          name: data.name!,
          description: data.description,
        });

        // Add confidents to the new project
        for (const confidentId of data.confident_ids || []) {
          try {
            await fetch(`/api/projects/${newProject.id}/confidents`, {
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

        // Add tags to the new project
        for (const tagId of data.tag_ids || []) {
          try {
            await fetch(`/api/projects/${newProject.id}/tags`, {
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

        // Refresh projects list
        const projectsResponse = await fetch("/api/projects");
        if (projectsResponse.ok) {
          const updatedProjects = await projectsResponse.json();
          setProjects(updatedProjects);
        }

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
        // Update confident using the hook
        await updateConfident(id, data as UpdateConfidentRequest);

        // Refresh confidents list
        const confidentsResponse = await fetch("/api/confidents");
        if (confidentsResponse.ok) {
          const updatedConfidents = await confidentsResponse.json();
          setConfidents(updatedConfidents);
        }

        notifier.success("Confident updated successfully!");
        setEditingConfident(null);
      } else {
        // Create confident using the hook
        await createConfident(data as CreateConfidentRequest);

        // Refresh confidents list
        const confidentsResponse = await fetch("/api/confidents");
        if (confidentsResponse.ok) {
          const updatedConfidents = await confidentsResponse.json();
          setConfidents(updatedConfidents);
        }

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
        // Update tag using the hook
        await updateTag(id, data as UpdateTagRequest);

        // Refresh tags list
        const tagsResponse = await fetch("/api/tags");
        if (tagsResponse.ok) {
          const updatedTags = await tagsResponse.json();
          setTags(updatedTags);
        }

        notifier.success("Tag updated successfully!");
        setEditingTag(null);
      } else {
        // Create tag using the hook
        await createTag(data as CreateTagRequest);

        // Refresh tags list
        const tagsResponse = await fetch("/api/tags");
        if (tagsResponse.ok) {
          const updatedTags = await tagsResponse.json();
          setTags(updatedTags);
        }

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
      await deleteProject(id);

      // Remove from local state immediately for better UX
      setProjects((prev) => prev.filter((p) => p.id !== id));
      notifier.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete project:", error);
      notifier.error("Failed to delete project");
    }
  };

  const handleDeleteConfident = async (id: number) => {
    try {
      await deleteConfident(id);

      // Remove from local state immediately for better UX
      setConfidents((prev) => prev.filter((c) => c.id !== id));
      notifier.success("Confident deleted successfully!");
    } catch (error) {
      console.error("Failed to delete confident:", error);
      notifier.error("Failed to delete confident");
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTag(id);

      // Remove from local state immediately for better UX
      setTags((prev) => prev.filter((t) => t.id !== id));
      notifier.success("Tag deleted successfully!");
    } catch (error) {
      console.error("Failed to delete tag:", error);
      notifier.error("Failed to delete tag");
    }
  };

  // Show loading state during SSR or while checking authentication
  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
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
                  <Button onClick={() => setShowProjectForm(true)}>
                    Add Project
                  </Button>
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
                  <Button onClick={() => setShowConfidentForm(true)}>
                    Add Confident
                  </Button>
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
                  <Button onClick={() => setShowTagForm(true)}>Add Tag</Button>
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
