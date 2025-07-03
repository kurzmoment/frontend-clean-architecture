import React, { useState, useEffect } from "react";
import type { Tag, CreateTagData, UpdateTagData } from "../../services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";

interface TagFormProps {
  onSubmit: (data: CreateTagData | UpdateTagData) => Promise<void>;
  onCancel: () => void;
  tag?: Tag;
  isLoading?: boolean;
}

export default function TagForm({
  onSubmit,
  onCancel,
  tag,
  isLoading = false,
}: TagFormProps) {
  const isEditing = !!tag;

  const [formData, setFormData] = useState<CreateTagData | UpdateTagData>({
    name: tag?.name || "",
    color: tag?.color || "#007bff",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name || "",
        color: tag.color || "#007bff",
      });
    }
  }, [tag]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.color?.trim()) {
      newErrors.color = "Color is required";
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
    >
      <Card className="max-w-2xl mx-auto mb-6">
        <CardHeader>
          <CardTitle>{tag ? "Edit Tag" : "Create New Tag"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">Tag Name</label>
                <Input
                  placeholder="Enter tag name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Color</label>
                <Input
                  type="color"
                  value={formData.color || "#007bff"}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
                {errors.color && (
                  <p className="text-sm text-red-500 mt-1">{errors.color}</p>
                )}
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
                {isLoading ? "Saving..." : tag ? "Update Tag" : "Create Tag"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
