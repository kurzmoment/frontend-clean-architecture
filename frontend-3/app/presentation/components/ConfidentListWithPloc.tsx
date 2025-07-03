import React, { useEffect, useState } from "react";
import { useConfidentPloc } from "../context/PlocProvider";
import { ConfidentEntity } from "../../my-core/confident/domain/Confident";
import ConfidentCard from "./ConfidentCard";
import { Button } from "../../components/ui/button";
import { Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ConfidentForm from "./ConfidentForm";

interface ConfidentListWithPlocProps {
  onViewConfident?: (confident: ConfidentEntity) => void;
}

const ConfidentListWithPloc: React.FC<ConfidentListWithPlocProps> = ({
  onViewConfident,
}) => {
  const confidentPloc = useConfidentPloc();
  const [showConfidentForm, setShowConfidentForm] = useState(false);
  const [editingConfident, setEditingConfident] =
    useState<ConfidentEntity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Subscribe to PLOC state changes
  useEffect(() => {
    const handleStateChange = (state: any) => {
      // State changes are handled automatically by the PLOC
    };

    confidentPloc.addListener(handleStateChange);
    return () => confidentPloc.removeListener(handleStateChange);
  }, [confidentPloc]);

  // Filter confidents based on search term
  const filteredConfidents = React.useMemo(() => {
    if (confidentPloc.state.kind !== "LoadedConfidentState") return [];

    if (!searchTerm.trim()) return confidentPloc.state.confidents;

    return confidentPloc.state.confidents.filter(
      (confident) =>
        confident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        confident.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        confident.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [confidentPloc.state, searchTerm]);

  const handleCreateConfident = async (data: any) => {
    await confidentPloc.createConfident(data);
    setShowConfidentForm(false);
  };

  const handleUpdateConfident = async (data: any) => {
    if (editingConfident) {
      await confidentPloc.updateConfident(editingConfident.id, data);
      setEditingConfident(null);
    }
  };

  const handleDeleteConfident = async (id: number) => {
    await confidentPloc.deleteConfident(id);
  };

  const handleEditConfident = (confident: any) => {
    // Convert plain Confident to ConfidentEntity for editing
    const confidentEntity = ConfidentEntity.fromJSON(confident);
    setEditingConfident(confidentEntity);
    setShowConfidentForm(true);
  };

  const handleViewConfident = (confident: any) => {
    if (onViewConfident) {
      // Convert plain Confident to ConfidentEntity for viewing
      const confidentEntity = ConfidentEntity.fromJSON(confident);
      onViewConfident(confidentEntity);
    }
  };

  // Render loading state
  if (confidentPloc.state.kind === "LoadingConfidentState") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading confidents...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (confidentPloc.state.kind === "ErrorConfidentState") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg mb-4">Error</div>
          <p className="text-muted-foreground">{confidentPloc.state.error}</p>
          <Button
            onClick={() => confidentPloc.loadConfidents()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Confidents</h1>
          <p className="text-muted-foreground">
            Manage your trusted contacts and relationships
          </p>
        </div>
        <Button
          onClick={() => setShowConfidentForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          Add Confident
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <input
          type="text"
          placeholder="Search confidents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Confident Form Modal */}
      <AnimatePresence>
        {(showConfidentForm || editingConfident) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowConfidentForm(false);
              setEditingConfident(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg p-6 w-full max-w-md mx-4"
            >
              <ConfidentForm
                initialValue={editingConfident?.toJSON()}
                onSubmit={
                  editingConfident
                    ? handleUpdateConfident
                    : handleCreateConfident
                }
                onCancel={() => {
                  setShowConfidentForm(false);
                  setEditingConfident(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredConfidents.map((confident) => (
            <motion.div
              key={confident.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ConfidentCard
                confident={confident.toJSON()}
                onEdit={handleEditConfident}
                onDelete={handleDeleteConfident}
                onView={handleViewConfident}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredConfidents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">
            {searchTerm ? "No confidents found" : "No confidents yet"}
          </div>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Start by adding your first confident"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowConfidentForm(true)}>
              Add Your First Confident
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfidentListWithPloc;
