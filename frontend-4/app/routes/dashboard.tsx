import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useLoaderData,
  Form,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { requireAuth } from "../lib/auth-loader";
import { logoutAction } from "../lib/auth-actions";
import ProjectForm from "../presentation/components/ProjectForm";
import ConfidentForm from "../presentation/components/ConfidentForm";
import TagForm from "../presentation/components/TagForm";
import type { Project, Confident, Tag } from "../services";
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
  CreateProjectData,
  UpdateProjectData,
  CreateConfidentData,
  UpdateConfidentData,
  CreateTagData,
  UpdateTagData,
} from "../services";
import ProjectCard from "../presentation/components/ProjectCard";
import ConfidentCard from "../presentation/components/ConfidentCard";
import TagCard from "../presentation/components/TagCard";
import {
  useProjects,
  useConfidents,
  useTags,
  projectQueryFunctions,
  confidentQueryFunctions,
  tagQueryFunctions,
} from "../infrastructure/query";
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
} from "../infrastructure/query";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const projects = await projectQueryFunctions.projects(request);
  const confidents = await confidentQueryFunctions.confidents(request);
  const tags = await tagQueryFunctions.tags(request);

  return { user, projects, confidents, tags };
}

export async function action(args: ActionFunctionArgs) {
  return logoutAction(args);
}

export default function DashboardPage() {
  const {
    user,
    projects: initialProjects,
    confidents: initialConfidents,
    tags: initialTags,
  } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<
    "projects" | "confidents" | "tags"
  >("projects");

  const navigate = useNavigate();

  // TanStack Query hooks
  const { data: projects = initialProjects, isLoading: projectsLoading } =
    useProjects(initialProjects);
  const { data: confidents = initialConfidents, isLoading: confidentsLoading } =
    useConfidents(initialConfidents);
  const { data: tags = initialTags, isLoading: tagsLoading } =
    useTags(initialTags);

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

  const isLoading = projectsLoading || confidentsLoading || tagsLoading;

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
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.username || "User"}
              </p>
            </div>
            <Form method="post">
              <Button type="submit" variant="outline">
                Logout
              </Button>
            </Form>
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
                  </div>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <p className="text-muted-foreground">
                      No projects found. Create your first project to get
                      started.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      <AnimatePresence>
                        {projects.slice(0, 6).map((project) => (
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
                              onView={() => navigate(`/projects/${project.id}`)}
                              onEdit={() => navigate(`/projects/${project.id}`)}
                              onDelete={() =>
                                deleteProjectMutation.mutate(project.id)
                              }
                              isLoading={deleteProjectMutation.isPending}
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
                  </div>
                </CardHeader>
                <CardContent>
                  {confidents.length === 0 ? (
                    <p className="text-muted-foreground">
                      No confidents found. Create your first confident to get
                      started.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      <AnimatePresence>
                        {confidents.slice(0, 6).map((confident) => (
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
                              onView={() =>
                                navigate(`/confidents/${confident.id}`)
                              }
                              onEdit={() =>
                                navigate(`/confidents/${confident.id}`)
                              }
                              onDelete={() =>
                                deleteConfidentMutation.mutate(confident.id)
                              }
                              isLoading={deleteConfidentMutation.isPending}
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
                  </div>
                </CardHeader>
                <CardContent>
                  {tags.length === 0 ? (
                    <p className="text-muted-foreground">
                      No tags found. Create your first tag to get started.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-4 mt-4">
                      <AnimatePresence>
                        {tags.slice(0, 12).map((tag) => (
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
                              onView={() => navigate(`/tags/${tag.id}`)}
                              onEdit={() => navigate(`/tags/${tag.id}`)}
                              onDelete={() => deleteTagMutation.mutate(tag.id)}
                              isLoading={deleteTagMutation.isPending}
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
