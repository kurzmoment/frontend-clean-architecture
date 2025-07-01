import { z } from "zod";
import type { Tag } from "../../shared-kernel";

// Zod schema for Tag validation
export const TagSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .optional(),
  user_id: z.number().positive("User ID must be positive"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Schema for creating a new tag (without id, created_at, updated_at)
export const CreateTagSchema = TagSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for form validation (without user_id, which is added automatically)
export const FormTagSchema = TagSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

// Schema for updating a tag (all fields optional except id)
export const UpdateTagSchema = TagSchema.partial().pick({
  name: true,
  color: true,
});

// Domain functions for Tag entity
export const createTag = (data: z.infer<typeof CreateTagSchema>): Tag => {
  const validatedData = CreateTagSchema.parse(data);
  return {
    ...validatedData,
    id: 0, // Will be set by the database
    created_at: undefined,
    updated_at: undefined,
  };
};

export const getDisplayColor = (tag: Tag): string => {
  return tag.color || "#6B7280"; // Default gray color
};

export const getContrastColor = (tag: Tag): string => {
  // Simple contrast calculation for readability
  if (!tag.color) return "#FFFFFF";

  // Convert hex to RGB and calculate luminance
  const hex = tag.color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export const isTagValid = (tag: Tag): boolean => {
  try {
    TagSchema.parse(tag);
    return true;
  } catch {
    return false;
  }
};

export const validateTag = (data: unknown): Tag => {
  return TagSchema.parse(data);
};

export const validateCreateTag = (
  data: unknown
): z.infer<typeof CreateTagSchema> => {
  return CreateTagSchema.parse(data);
};

export const validateUpdateTag = (
  data: unknown
): z.infer<typeof UpdateTagSchema> => {
  return UpdateTagSchema.parse(data);
};
