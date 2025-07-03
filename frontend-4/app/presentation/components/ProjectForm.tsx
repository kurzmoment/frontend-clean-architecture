import React, { useState, useEffect } from "react";
import type {
  Confident,
  Tag,
  Project,
  CreateProjectData,
  UpdateProjectData,
} from "../../services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { motion } from "motion/react";

interface ProjectFormProps {
  onCancel: () => void;
  confidents: Confident[];
  tags: Tag[];
  project?: Project;
  onSubmit: (data: CreateProjectData | UpdateProjectData) => Promise<void>;
  isLoading?: boolean;
}

export default function ProjectForm({
  onCancel,
  confidents,
  tags,
  project,
  onSubmit,
  isLoading = false,
}: ProjectFormProps) {
  const isEditing = !!project;

  const [formData, setFormData] = useState<
    CreateProjectData | UpdateProjectData
  >({
    name: project?.name || "",
    description: project?.description || "",
    confident_ids: project?.confidents?.map((c) => c.id) || [],
    tag_ids: project?.tags?.map((t) => t.id) || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        confident_ids: project.confidents?.map((c) => c.id) || [],
        tag_ids: project.tags?.map((t) => t.id) || [],
      });
    }
  }, [project]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleConfidentToggle = (confidentId: number) => {
    const currentIds = formData.confident_ids || [];
    const newIds = currentIds.includes(confidentId)
      ? currentIds.filter((id) => id !== confidentId)
      : [...currentIds, confidentId];

    setFormData((prev) => ({ ...prev, confident_ids: newIds }));
  };

  const handleTagToggle = (tagId: number) => {
    const currentIds = formData.tag_ids || [];
    const newIds = currentIds.includes(tagId)
      ? currentIds.filter((id) => id !== tagId)
      : [...currentIds, tagId];

    setFormData((prev) => ({ ...prev, tag_ids: newIds }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="max-w-3xl mx-auto mb-10 shadow-2xl border border-gray-100 bg-background/90 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {project ? "Edit Project" : "Create New Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="Enter project name"
                  className="mt-2"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Enter project description"
                  className="mt-2"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Confidents</label>
                <div className="space-y-2 mt-2">
                  {confidents.map((confident) => (
                    <div key={confident.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`confident-${confident.id}`}
                        checked={
                          formData.confident_ids?.includes(confident.id) ||
                          false
                        }
                        onCheckedChange={() =>
                          handleConfidentToggle(confident.id)
                        }
                      />
                      <label
                        htmlFor={`confident-${confident.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {confident.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <div className="space-y-2 mt-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={formData.tag_ids?.includes(tag.id) || false}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <label
                        htmlFor={`tag-${tag.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: tag.color,
                            color: "#fff",
                          }}
                        >
                          {tag.name}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : project
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
