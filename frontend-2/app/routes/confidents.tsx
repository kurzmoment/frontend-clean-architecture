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
import ConfidentForm from "../presentation/components/ConfidentForm";
import type { Confident } from "../shared-kernel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import type {
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../shared-kernel";
import ConfidentCard from "../presentation/components/ConfidentCard";
import {
  getServerUser,
  isServerAuthenticated,
} from "../infrastructure/auth/server-auth";
import { serverQueryFunctions } from "../infrastructure/query/queries";
import { useConfidents } from "../infrastructure/query/queries";
import {
  useCreateConfident,
  useUpdateConfident,
  useDeleteConfident,
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
    const confidents = await serverQueryFunctions.confidents(request);
    return { confidents, user };
  } catch (error) {
    console.error("Failed to load confidents in loader:", error);
    throw new Response("Failed to load confidents", { status: 500 });
  }
}

export default function ConfidentsPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { confidents: initialConfidents, user: serverUser } = loaderData;

  const [showConfidentForm, setShowConfidentForm] = useState(false);
  const [editingConfident, setEditingConfident] = useState<Confident | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { logout } = useAuthenticate();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // TanStack Query hooks
  const { data: confidents = initialConfidents, isLoading } = useConfidents();

  // Mutation hooks
  const createConfidentMutation = useCreateConfident();
  const updateConfidentMutation = useUpdateConfident();
  const deleteConfidentMutation = useDeleteConfident();

  // Use server user or fallback to client user
  const user = useMemo(() => {
    return serverUser || userStorage.getUser();
  }, [serverUser, userStorage]);

  // Filter confidents based on search term
  const filteredConfidents = useMemo(() => {
    if (!searchTerm.trim()) return confidents;
    return confidents.filter(
      (confident) =>
        confident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        confident.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        confident.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [confidents, searchTerm]);

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
      } else {
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

  const handleDeleteConfident = async (id: number) => {
    try {
      await deleteConfidentMutation.mutateAsync(id);
      notifier.success("Confident deleted successfully!");
    } catch (error) {
      console.error("Failed to delete confident:", error);
      notifier.error("Failed to delete confident");
    }
  };

  const handleViewConfident = (confident: Confident) => {
    navigate(`/confidents/${confident.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading confidents...</p>
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
              <h1 className="text-3xl font-bold">Confidents</h1>
              <p className="text-muted-foreground">
                Manage your trusted contacts and relationships
              </p>
            </div>
            <div className="flex items-center gap-4">
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
        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>All Confidents ({filteredConfidents.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search confidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={() => setShowConfidentForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
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

            {filteredConfidents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm
                    ? "No confidents found matching your search."
                    : "No confidents found. Add your first confident to get started."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowConfidentForm(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Confident
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredConfidents.map((confident) => (
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
      </main>
    </div>
  );
}
