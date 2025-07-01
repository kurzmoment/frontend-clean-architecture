import { z } from "zod";
import type { Confident } from "../../shared-kernel";

// Zod schema for Confident validation
export const ConfidentSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z
    .union([z.string().email("Invalid email format"), z.literal("")])
    .optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
  user_id: z.number().positive("User ID must be positive"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Schema for creating a new confident (without id, created_at, updated_at)
export const CreateConfidentSchema = ConfidentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for form validation (without user_id, which is added automatically)
export const FormConfidentSchema = ConfidentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

// Schema for updating a confident (all fields optional except id)
export const UpdateConfidentSchema = ConfidentSchema.partial().pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  position: true,
  notes: true,
});

// Domain functions for Confident entity
export const createConfident = (
  data: z.infer<typeof CreateConfidentSchema>
): Confident => {
  const validatedData = CreateConfidentSchema.parse(data);
  return {
    ...validatedData,
    id: 0, // Will be set by the database
    created_at: undefined,
    updated_at: undefined,
  };
};

export const getConfidentDisplayName = (confident: Confident): string => {
  if (confident.company && confident.position) {
    return `${confident.name} - ${confident.position} at ${confident.company}`;
  }
  if (confident.company) {
    return `${confident.name} - ${confident.company}`;
  }
  if (confident.position) {
    return `${confident.name} - ${confident.position}`;
  }
  return confident.name;
};

export const hasContactInfo = (confident: Confident): boolean => {
  return !!(confident.email || confident.phone);
};

export const isConfidentValid = (confident: Confident): boolean => {
  try {
    ConfidentSchema.parse(confident);
    return true;
  } catch {
    return false;
  }
};

export const validateConfident = (data: unknown): Confident => {
  return ConfidentSchema.parse(data);
};

export const validateCreateConfident = (
  data: unknown
): z.infer<typeof CreateConfidentSchema> => {
  return CreateConfidentSchema.parse(data);
};

export const validateUpdateConfident = (
  data: unknown
): z.infer<typeof UpdateConfidentSchema> => {
  return UpdateConfidentSchema.parse(data);
};
