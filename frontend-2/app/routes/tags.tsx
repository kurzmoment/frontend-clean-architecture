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
import { serverQueryFunctions } from "../infrastructure/query/queries";
import { useTags } from "../infrastructure/query/queries";
import {
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
    const tags = await serverQueryFunctions.tags(request);
    return { tags, user };
  } catch (error) {
    console.error("Failed to load tags in loader:", error);
    throw new Response("Failed to load tags", { status: 500 });
  }
}

export default function TagsPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { tags: initialTags, user: serverUser } = loaderData;

  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { logout } = useAuthenticate();
  const userStorage = useUserStorage();
  const navigate = useNavigate();
  const notifier = useNotifier();

  // TanStack Query hooks
  const { data: tags = initialTags, isLoading } = useTags();

  // Mutation hooks
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

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
    try {
      if (id) {
        await updateTagMutation.mutateAsync({
          id,
          data: data as UpdateTagRequest,
        });
        notifier.success("Tag updated successfully!");
        setEditingTag(null);
      } else {
        await createTagMutation.mutateAsync(data as CreateTagRequest);
        notifier.success("Tag created successfully!");
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
    } catch (error) {
      console.error("Failed to delete tag:", error);
      notifier.error("Failed to delete tag");
    }
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
