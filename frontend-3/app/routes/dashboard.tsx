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
import { AnimatePresence, motion } from "motion/react";

import ProjectCard from "../presentation/components/ProjectCard";
import ConfidentCard from "../presentation/components/ConfidentCard";
import TagCard from "../presentation/components/TagCard";
import {
  getServerUser,
  isServerAuthenticated,
} from "../infrastructure/auth/server-auth";
import { serverQueryFunctions } from "../infrastructure/query";
import { useProjects, useConfidents, useTags } from "../infrastructure/query";

export async function loader({ request }: LoaderFunctionArgs) {
  // Check authentication on server
  if (!isServerAuthenticated(request)) {
    throw redirect("/login");
  }

  const user = await getServerUser(request);
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

  // Use server user or fallback to client user
  const user = useMemo(() => {
    return serverUser || userStorage.getUser();
  }, [serverUser, userStorage]);

  const isLoading = projectsLoading || confidentsLoading || tagsLoading;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
                    <Button
                      variant="outline"
                      onClick={() => navigate("/confidents-with-ploc")}
                    >
                      View with PLOC
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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
                  </div>
                </CardHeader>
                <CardContent>
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
