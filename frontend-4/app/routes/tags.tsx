import React, { useState, useMemo } from "react";
import { Link, useNavigate, useRevalidator } from "react-router";
import { authService } from "../services";
import TagForm from "../presentation/components/TagForm";
import type { Tag } from "../services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import type { CreateTagData, UpdateTagData } from "../services";
import TagCard from "../presentation/components/TagCard";
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "../infrastructure/query";

export default function TagsPage() {
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const revalidator = useRevalidator();

  // TanStack Query hooks
  const { data: tags = [], isLoading } = useTags();

  // Mutation hooks
  const createTagMutation = useCreateTag();
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

  // Filter tags based on search term
  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return tags;
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tags, searchTerm]);

  const handleLogout = async () => {
    authService.logout();
    navigate("/login");
  };

  const handleCreateTag = async (data: CreateTagData) => {
    try {
      await createTagMutation.mutateAsync(data);
      setShowTagForm(false);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleUpdateTag = async (id: number, data: UpdateTagData) => {
    try {
      await updateTagMutation.mutateAsync({ id, data });
      setEditingTag(null);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagMutation.mutateAsync(id);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
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
              <h1 className="text-3xl font-bold text-foreground">Tags</h1>
              <p className="text-muted-foreground">
                Organize your projects with custom tags
              </p>
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
        {/* Search and Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={() => setShowTagForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Tag
          </Button>
        </div>

        {/* Tag Form Modal */}
        <AnimatePresence>
          {showTagForm && (
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
                  onSubmit={handleCreateTag}
                  onCancel={() => setShowTagForm(false)}
                  isLoading={createTagMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Tag Form Modal */}
        <AnimatePresence>
          {editingTag && (
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
                  onCancel={() => setEditingTag(null)}
                  isLoading={updateTagMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags Grid */}
        {filteredTags.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {searchTerm
                ? "No tags found matching your search."
                : "No tags yet."}
            </div>
            {!searchTerm && (
              <Button onClick={() => setShowTagForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first tag
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTags.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                onView={() => handleViewTag(tag)}
                onEdit={() => setEditingTag(tag)}
                onDelete={() => handleDeleteTag(tag.id)}
                isLoading={deleteTagMutation.isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
