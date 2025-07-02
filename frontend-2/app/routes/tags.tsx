import React, { useState, useMemo } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useActionData,
  useNavigation,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "react-router";
import { useAuthenticate } from "../presentation/hooks/use-authenticate";
import { useUserStorage } from "../presentation/hooks/use-user-storage";
import { useNotifier } from "../presentation/hooks/use-notifier";
import TagForm from "../presentation/components/TagForm";
import type { Tag } from "../shared-kernel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import type { CreateTagRequest, UpdateTagRequest } from "../shared-kernel";
import TagCard from "../presentation/components/TagCard";
import {
  getServerUser,
  isServerAuthenticated,
} from "../infrastructure/auth/server-auth";
import {
  serverQueryFunctions,
  serverMutationFunctions,
} from "../infrastructure/query/queries";
import { useTags } from "../infrastructure/query/queries";

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
    const tags = await serverQueryFunctions.tags(request);
    return { tags, user };
  } catch (error) {
    console.error("Failed to load tags in loader:", error);
    throw new Response("Failed to load tags", { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  // Check authentication on server
  if (!isServerAuthenticated(request)) {
    throw redirect("/login");
  }

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  console.log("--------------------------------");
  console.log("TAGS ACTION - INTENT:", intent);
  console.log("--------------------------------");

  try {
    switch (intent) {
      case "create":
        await serverMutationFunctions.createTag(request);
        return { success: true, message: "Tag created successfully" };

      case "update":
        const updateId = parseInt(formData.get("id") as string);
        if (isNaN(updateId)) {
          throw new Error("Invalid tag ID");
        }
        await serverMutationFunctions.updateTag(request, updateId);
        return { success: true, message: "Tag updated successfully" };

      case "delete":
        const deleteId = parseInt(formData.get("id") as string);
        if (isNaN(deleteId)) {
          throw new Error("Invalid tag ID");
        }
        await serverMutationFunctions.deleteTag(request, deleteId);
        return { success: true, message: "Tag deleted successfully" };

      default:
        throw new Error("Invalid action intent");
    }
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export default function TagsPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { tags: initialTags, user: serverUser } = loaderData;

  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { logout } = useAuthenticate();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // Show action result if available
  React.useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        notifier.success(actionData.message);
        // Close form on success
        setShowTagForm(false);
        setEditingTag(null);
      } else {
        notifier.error(actionData.message);
      }
    }
  }, [actionData, notifier]);

  // TanStack Query hooks
  const { data: tags = initialTags, isLoading } = useTags();

  // Use server user or fallback to client user
  const user = useMemo(() => {
    return serverUser || userStorage.getUser();
  }, [serverUser, userStorage]);

  // Filter tags based on search term
  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return tags;
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tags, searchTerm]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleTagForm = async (
    data: CreateTagRequest | UpdateTagRequest,
    id?: number
  ) => {
    // This function is no longer used since we're using SSR actions
    // The form submission is handled by the action function
  };

  const handleDeleteTag = async (id: number) => {
    // This function is no longer used since we're using SSR actions
    // The delete is handled by the action function
  };

  const handleViewTag = (tag: Tag) => {
    navigate(`/tags/${tag.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tags...</p>
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
              <h1 className="text-3xl font-bold">Tags</h1>
              <p className="text-muted-foreground">
                Organize your projects with custom tags
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
            <CardTitle>All Tags ({filteredTags.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={() => setShowTagForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
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

            {filteredTags.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm
                    ? "No tags found matching your search."
                    : "No tags found. Create your first tag to get started."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowTagForm(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Tag
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <AnimatePresence>
                  {filteredTags.map((tag) => (
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
      </main>
    </div>
  );
}
