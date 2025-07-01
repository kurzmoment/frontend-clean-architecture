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
import ConfidentForm from "../presentation/components/ConfidentForm";
import type { Project, Confident } from "../shared-kernel";
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
  MapPin,
} from "lucide-react";
import type {
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../shared-kernel";
import {
  getServerUser,
  isServerAuthenticated,
} from "../infrastructure/auth/server-auth";
import { serverQueryFunctions } from "../infrastructure/query/queries";
import { useConfidents, useProjects } from "../infrastructure/query/queries";
import {
  useUpdateConfident,
  useDeleteConfident,
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

  const confidentId = params.confidentId;
  if (!confidentId) {
    throw redirect("/confidents");
  }

  // Pre-fetch data for SSR
  try {
    const [confidents, projects] = await Promise.all([
      serverQueryFunctions.confidents(request),
      serverQueryFunctions.projects(request),
    ]);

    const confident = confidents.find((c) => c.id === parseInt(confidentId));
    if (!confident) {
      throw new Response("Confident not found", { status: 404 });
    }

    // Find projects that include this confident
    const relatedProjects = projects.filter((project) =>
      project.confidents?.some((c) => c.id === confident.id)
    );

    return { confident, relatedProjects, user };
  } catch (error) {
    console.error("Failed to load confident in loader:", error);
    if (error instanceof Response) throw error;
    throw new Response("Failed to load confident", { status: 500 });
  }
}

export default function ConfidentDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  const {
    confident: initialConfident,
    relatedProjects: initialRelatedProjects,
    user: serverUser,
  } = loaderData;
  const params = useParams();
  const confidentId = params.confidentId;

  const [showConfidentForm, setShowConfidentForm] = useState(false);
  const [editingConfident, setEditingConfident] = useState<Confident | null>(
    null
  );

  const { logout } = useAuthenticate();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // TanStack Query hooks
  const {
    data: confidents = [initialConfident],
    isLoading: confidentsLoading,
  } = useConfidents();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  // Mutation hooks
  const updateConfidentMutation = useUpdateConfident();
  const deleteConfidentMutation = useDeleteConfident();

  // Use server user or fallback to client user
  const user = useMemo(() => {
    return serverUser || userStorage.getUser();
  }, [serverUser, userStorage]);

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
    await logout();
    navigate("/login");
  };

  const handleConfidentForm = async (
    data: CreateConfidentRequest | UpdateConfidentRequest,
    id?: number
  ) => {
    try {
      if (id) {
        await updateConfidentMutation.mutateAsync({
          id,
          data: data as UpdateConfidentRequest,
        });
        notifier.success("Confident updated successfully!");
        setEditingConfident(null);
      }
      setShowConfidentForm(false);
    } catch (error) {
      console.error("Confident operation failed:", error);
      notifier.error("Failed to save confident");
    }
  };

  const handleDeleteConfident = async (id: number) => {
    try {
      await deleteConfidentMutation.mutateAsync(id);
      notifier.success("Confident deleted successfully!");
      navigate("/confidents");
    } catch (error) {
      console.error("Failed to delete confident:", error);
      notifier.error("Failed to delete confident");
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
              <Button
                variant="outline"
                onClick={() => navigate("/confidents")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Confidents
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{confident.name}</h1>
                <p className="text-muted-foreground">Confident Details</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingConfident(confident);
                  setShowConfidentForm(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteConfident(confident.id)}
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
          {showConfidentForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Confident Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{confident.name}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {confident.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{confident.email}</p>
                      </div>
                    </div>
                  )}

                  {confident.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{confident.phone}</p>
                      </div>
                    </div>
                  )}

                  {confident.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{confident.company}</p>
                      </div>
                    </div>
                  )}

                  {confident.position && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Position
                        </p>
                        <p className="font-medium">{confident.position}</p>
                      </div>
                    </div>
                  )}
                </div>

                {confident.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm">{confident.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created:{" "}
                    {new Date(confident.created_at || "").toLocaleDateString()}
                  </span>
                </div>

                {confident.updated_at &&
                  confident.updated_at !== confident.created_at && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Updated:{" "}
                        {new Date(confident.updated_at).toLocaleDateString()}
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
                    Related Projects ({relatedProjects.length})
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
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Confident
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Stats</CardTitle>
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
                  <span className="text-muted-foreground">Has Email:</span>
                  <span className="font-semibold">
                    {confident.email ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Has Phone:</span>
                  <span className="font-semibold">
                    {confident.phone ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Has Company:</span>
                  <span className="font-semibold">
                    {confident.company ? "Yes" : "No"}
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
