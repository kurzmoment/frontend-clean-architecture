import React, { useState, useEffect } from "react";
import type {
  Confident,
  CreateConfidentData,
  UpdateConfidentData,
} from "../../services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";

interface ConfidentFormProps {
  onSubmit: (data: CreateConfidentData | UpdateConfidentData) => Promise<void>;
  onCancel: () => void;
  confident?: Confident;
  isLoading?: boolean;
}

export default function ConfidentForm({
  onSubmit,
  onCancel,
  confident,
  isLoading = false,
}: ConfidentFormProps) {
  const isEditing = !!confident;

  const [formData, setFormData] = useState<
    CreateConfidentData | UpdateConfidentData
  >({
    name: confident?.name || "",
    email: confident?.email || "",
    phone: confident?.phone || "",
    company: confident?.company || "",
    position: confident?.position || "",
    notes: confident?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (confident) {
      setFormData({
        name: confident.name || "",
        email: confident.email || "",
        phone: confident.phone || "",
        company: confident.company || "",
        position: confident.position || "",
        notes: confident.notes || "",
      });
    }
  }, [confident]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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
          <CardTitle>
            {confident ? "Edit Confident" : "Create New Confident"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">Confident Name</label>
                <Input
                  placeholder="Enter confident name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Company</label>
                <Input
                  placeholder="Enter company name"
                  value={formData.company || ""}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Position</label>
                <Input
                  placeholder="Enter position/title"
                  value={formData.position || ""}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter any additional notes"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive md:text-sm text-foreground"
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
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
                  : confident
                  ? "Update Confident"
                  : "Create Confident"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
