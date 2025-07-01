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
import TagForm from "../presentation/components/TagForm";
import type { Project, Tag } from "../shared-kernel";
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
  FileText,
  Tag as TagIcon,
} from "lucide-react";
import type { CreateTagRequest, UpdateTagRequest } from "../shared-kernel";
import {
  getServerUser,
  isServerAuthenticated,
} from "../infrastructure/auth/server-auth";
import { serverQueryFunctions } from "../infrastructure/query/queries";
import { useTags, useProjects } from "../infrastructure/query/queries";
import { useUpdateTag, useDeleteTag } from "../infrastructure/query/mutations";

export async function loader({ request, params }: LoaderFunctionArgs) {
  // Check authentication on server
  if (!isServerAuthenticated(request)) {
    throw redirect("/login");
  }

  const user = getServerUser(request);
  if (!user) {
    throw redirect("/login");
  }

  const tagId = params.tagId;
  if (!tagId) {
    throw redirect("/tags");
  }

  // Pre-fetch data for SSR
  try {
    const [tags, projects] = await Promise.all([
      serverQueryFunctions.tags(request),
      serverQueryFunctions.projects(request),
    ]);

    const tag = tags.find((t) => t.id === parseInt(tagId));
    if (!tag) {
      throw new Response("Tag not found", { status: 404 });
    }

    // Find projects that include this tag
    const relatedProjects = projects.filter((project) =>
      project.tags?.some((t) => t.id === tag.id)
    );

    return { tag, relatedProjects, user };
  } catch (error) {
    console.error("Failed to load tag in loader:", error);
    if (error instanceof Response) throw error;
    throw new Response("Failed to load tag", { status: 500 });
  }
}

export default function TagDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  const {
    tag: initialTag,
    relatedProjects: initialRelatedProjects,
    user: serverUser,
  } = loaderData;
  const params = useParams();
  const tagId = params.tagId;

  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const { logout } = useAuthenticate();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // TanStack Query hooks
  const { data: tags = [initialTag], isLoading: tagsLoading } = useTags();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  // Mutation hooks
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  // Use server user or fallback to client user
  const user = useMemo(() => {
    return serverUser || userStorage.getUser();
  }, [serverUser, userStorage]);

  // Find current tag
  const tag = useMemo(() => {
    return tags.find((t) => t.id === parseInt(tagId!));
  }, [tags, tagId]);

  // Find related projects
  const relatedProjects = useMemo(() => {
    if (!tag) return [];
    return projects.filter((project) =>
      project.tags?.some((t) => t.id === tag.id)
    );
  }, [projects, tag]);

  const isLoading = tagsLoading || projectsLoading;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleTagForm = async (
    data: CreateTagRequest | UpdateTagRequest,
    id?: number
  ) => {
    try {
      if (id) {
        await updateTagMutation.mutateAsync({
          id,
          data: data as UpdateTagRequest,
        });
        notifier.success("Tag updated successfully!");
        setEditingTag(null);
      }
      setShowTagForm(false);
    } catch (error) {
      console.error("Tag operation failed:", error);
      notifier.error("Failed to save tag");
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagMutation.mutateAsync(id);
      notifier.success("Tag deleted successfully!");
      navigate("/tags");
    } catch (error) {
      console.error("Failed to delete tag:", error);
      notifier.error("Failed to delete tag");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tag...</p>
        </div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tag Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The tag you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/tags")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tags
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
                onClick={() => navigate("/tags")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Tags
              </Button>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="text-lg px-3 py-1"
                  style={{ backgroundColor: tag.color || undefined }}
                >
                  {tag.name}
                </Badge>
                <div>
                  <h1 className="text-3xl font-bold">{tag.name}</h1>
                  <p className="text-muted-foreground">Tag Details</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingTag(tag);
                  setShowTagForm(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTag(tag.id)}
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
          {showTagForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tag Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="h-5 w-5" />
                  Tag Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className="text-lg px-4 py-2"
                    style={{ backgroundColor: tag.color || undefined }}
                  >
                    {tag.name}
                  </Badge>
                  {tag.color && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Color:
                      </span>
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: tag.color }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created:{" "}
                    {new Date(tag.created_at || "").toLocaleDateString()}
                  </span>
                </div>

                {tag.updated_at && tag.updated_at !== tag.created_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Updated: {new Date(tag.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Projects with this Tag ({relatedProjects.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedProjects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold">{project.name}</h4>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            View Project
                          </Button>
                        </div>
                      </div>
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
                    setEditingTag(tag);
                    setShowTagForm(true);
                  }}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Tag
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTag(tag.id)}
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Tag
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tag Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Related Projects:
                  </span>
                  <span className="font-semibold">
                    {relatedProjects.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Has Color:</span>
                  <span className="font-semibold">
                    {tag.color ? "Yes" : "No"}
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
