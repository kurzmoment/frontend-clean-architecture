import React, { useState, useMemo } from "react";
import { Link, useNavigate, useRevalidator } from "react-router";
import { authService } from "../services";
import ConfidentForm from "../presentation/components/ConfidentForm";
import type { Confident } from "../services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import type { CreateConfidentData, UpdateConfidentData } from "../services";
import ConfidentCard from "../presentation/components/ConfidentCard";
import {
  useConfidents,
  useCreateConfident,
  useUpdateConfident,
  useDeleteConfident,
} from "../infrastructure/query";

export default function ConfidentsPage() {
  const [showConfidentForm, setShowConfidentForm] = useState(false);
  const [editingConfident, setEditingConfident] = useState<Confident | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const revalidator = useRevalidator();

  // TanStack Query hooks
  const { data: confidents = [], isLoading } = useConfidents();

  // Mutation hooks
  const createConfidentMutation = useCreateConfident();
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
    authService.logout();
    navigate("/login");
  };

  const handleCreateConfident = async (data: CreateConfidentData) => {
    try {
      await createConfidentMutation.mutateAsync(data);
      setShowConfidentForm(false);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleUpdateConfident = async (
    id: number,
    data: UpdateConfidentData
  ) => {
    try {
      await updateConfidentMutation.mutateAsync({ id, data });
      setEditingConfident(null);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteConfident = async (id: number) => {
    try {
      await deleteConfidentMutation.mutateAsync(id);
      revalidator.revalidate();
    } catch (error) {
      // Error is handled by the mutation hook
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
              <h1 className="text-3xl font-bold text-foreground">Confidents</h1>
              <p className="text-muted-foreground">
                Manage your trusted contacts and relationships
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
              placeholder="Search confidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={() => setShowConfidentForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Confident
          </Button>
        </div>

        {/* Confident Form Modal */}
        <AnimatePresence>
          {showConfidentForm && (
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
                  onSubmit={handleCreateConfident}
                  onCancel={() => setShowConfidentForm(false)}
                  isLoading={createConfidentMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Confident Form Modal */}
        <AnimatePresence>
          {editingConfident && (
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
                  onCancel={() => setEditingConfident(null)}
                  isLoading={updateConfidentMutation.isPending}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confidents Grid */}
        {filteredConfidents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {searchTerm
                ? "No confidents found matching your search."
                : "No confidents yet."}
            </div>
            {!searchTerm && (
              <Button onClick={() => setShowConfidentForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first confident
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConfidents.map((confident) => (
              <ConfidentCard
                key={confident.id}
                confident={confident}
                onView={() => handleViewConfident(confident)}
                onEdit={() => setEditingConfident(confident)}
                onDelete={() => handleDeleteConfident(confident.id)}
                isLoading={deleteConfidentMutation.isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
