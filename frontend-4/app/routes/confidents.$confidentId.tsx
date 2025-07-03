import React, { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { authService, notificationService } from "../services";
import ConfidentForm from "../presentation/components/ConfidentForm";
import type { Project, Confident } from "../services";
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
  User,
  Mail,
  Phone,
} from "lucide-react";
import type { CreateConfidentData, UpdateConfidentData } from "../services";
import { useConfidents, useProjects } from "../infrastructure/query";
import {
  useUpdateConfident,
  useDeleteConfident,
} from "../infrastructure/query";

export default function ConfidentDetailPage() {
  const params = useParams();
  const confidentId = params.confidentId;

  const [showConfidentForm, setShowConfidentForm] = useState(false);
  const [editingConfident, setEditingConfident] = useState<Confident | null>(
    null
  );

  const navigate = useNavigate();

  // TanStack Query hooks
  const { data: confidents = [], isLoading: confidentsLoading } =
    useConfidents();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  // Mutation hooks
  const updateConfidentMutation = useUpdateConfident();
  const deleteConfidentMutation = useDeleteConfident();

  // Get current user
  const user = authService.getCurrentUser();

  // Check authentication
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Find current confident
  const confident = useMemo(() => {
    return confidents.find((c) => c.id === parseInt(confidentId!));
  }, [confidents, confidentId]);

  // Find related projects
  const relatedProjects = useMemo(() => {
    if (!confident) return [];
    return projects.filter((project) =>
      project.confidents?.some((c) => c.id === confident.id)
    );
  }, [projects, confident]);

  const isLoading = confidentsLoading || projectsLoading;

  const handleLogout = async () => {
    authService.logout();
    navigate("/login");
  };

  const handleUpdateConfident = async (
    id: number,
    data: UpdateConfidentData
  ) => {
    try {
      await updateConfidentMutation.mutateAsync({ id, data });
      notificationService.success("Confident updated successfully!");
      setEditingConfident(null);
      setShowConfidentForm(false);
    } catch (error) {
      notificationService.error("Failed to save confident");
    }
  };

  const handleDeleteConfident = async (id: number) => {
    try {
      await deleteConfidentMutation.mutateAsync(id);
      notificationService.success("Confident deleted successfully!");
      navigate("/confidents");
    } catch (error) {
      notificationService.error("Failed to delete confident");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading confident...</p>
        </div>
      </div>
    );
  }

  if (!confident) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Confident Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The confident you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/confidents")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Confidents
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
              <Button variant="outline" onClick={() => navigate("/confidents")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Confidents
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {confident.name}
                </h1>
                <p className="text-muted-foreground">
                  Confident details and related projects
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
            {/* Confident Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Confident Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge className="text-lg px-4 py-2">
                      {confident.name}
                    </Badge>
                    {confident.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{confident.email}</span>
                      </div>
                    )}
                  </div>
                  {confident.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{confident.phone}</span>
                    </div>
                  )}
                  {confident.notes && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">
                        {confident.notes}
                      </p>
                    </div>
                  )}
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
                    No projects are associated with this confident.
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
                    setEditingConfident(confident);
                    setShowConfidentForm(true);
                  }}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Confident
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteConfident(confident.id)}
                  disabled={deleteConfidentMutation.isPending}
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {deleteConfidentMutation.isPending
                    ? "Deleting..."
                    : "Delete Confident"}
                </Button>
              </CardContent>
            </Card>

            {/* Confident Info */}
            <Card>
              <CardHeader>
                <CardTitle>Confident Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {new Date(confident.created_at || "").toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>
                    {new Date(confident.updated_at || "").toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Confident Form Modal */}
        <AnimatePresence>
          {showConfidentForm && editingConfident && (
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
                <ConfidentForm
                  confident={editingConfident}
                  onSubmit={(data) =>
                    handleUpdateConfident(editingConfident.id, data)
                  }
                  onCancel={() => {
                    setShowConfidentForm(false);
                    setEditingConfident(null);
                  }}
                  isLoading={updateConfidentMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
