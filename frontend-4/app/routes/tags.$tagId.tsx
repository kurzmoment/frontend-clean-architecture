import React, { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { authService, notificationService } from "../services";
import TagForm from "../presentation/components/TagForm";
import type { Project, Tag } from "../services";
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
import type { CreateTagData, UpdateTagData } from "../services";
import { useTags, useProjects } from "../infrastructure/query";
import { useUpdateTag, useDeleteTag } from "../infrastructure/query";

export default function TagDetailPage() {
  const params = useParams();
  const tagId = params.tagId;

  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const navigate = useNavigate();

  // TanStack Query hooks
  const { data: tags = [], isLoading: tagsLoading } = useTags();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  // Mutation hooks
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  // Get current user
  const user = authService.getCurrentUser();

  // Check authentication
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

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
    authService.logout();
    navigate("/login");
  };

  const handleUpdateTag = async (id: number, data: UpdateTagData) => {
    try {
      await updateTagMutation.mutateAsync({ id, data });
      notificationService.success("Tag updated successfully!");
      setEditingTag(null);
      setShowTagForm(false);
    } catch (error) {
      notificationService.error("Failed to save tag");
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagMutation.mutateAsync(id);
      notificationService.success("Tag deleted successfully!");
      navigate("/tags");
    } catch (error) {
      notificationService.error("Failed to delete tag");
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
              <Button variant="outline" onClick={() => navigate("/tags")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tags
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {tag.name}
                </h1>
                <p className="text-muted-foreground">
                  Tag details and related projects
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
            {/* Tag Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="h-5 w-5" />
                  Tag Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge
                    style={{
                      backgroundColor: tag.color,
                      color: "#fff",
                    }}
                    className="text-lg px-4 py-2"
                  >
                    {tag.name}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Color: {tag.color}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Related Projects ({relatedProjects.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {relatedProjects.length > 0 ? (
                  <div className="space-y-4">
                    {relatedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-foreground">
                          {project.name}
                        </h4>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created:{" "}
                            {new Date(
                              project.created_at || ""
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No projects are using this tag.
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
                  disabled={deleteTagMutation.isPending}
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {deleteTagMutation.isPending ? "Deleting..." : "Delete Tag"}
                </Button>
              </CardContent>
            </Card>

            {/* Tag Info */}
            <Card>
              <CardHeader>
                <CardTitle>Tag Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {new Date(tag.created_at || "").toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>
                    {new Date(tag.updated_at || "").toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Tag Form Modal */}
        <AnimatePresence>
          {showTagForm && editingTag && (
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
                <TagForm
                  tag={editingTag}
                  onSubmit={(data) => handleUpdateTag(editingTag.id, data)}
                  onCancel={() => {
                    setShowTagForm(false);
                    setEditingTag(null);
                  }}
                  isLoading={updateTagMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
