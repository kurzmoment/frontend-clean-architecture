import { z } from "zod";
import type {
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateConfidentRequest,
  UpdateConfidentRequest,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";

// Authentication schemas
export const CreateUserRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterFormSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    username: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  }),
  token: z.string(),
  message: z.string().optional(),
});

// Project request schemas
export const CreateProjectRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  confident_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional(),
});

export const UpdateProjectRequestSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  confident_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional(),
});

// Confident request schemas
export const CreateConfidentRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateConfidentRequestSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
});

// Tag request schemas
export const CreateTagRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .optional(),
});

export const UpdateTagRequestSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .optional(),
});

// Validation functions
export const validateCreateUserRequest = (data: unknown): CreateUserRequest => {
  return CreateUserRequestSchema.parse(data);
};

export const validateLoginRequest = (data: unknown): LoginRequest => {
  return LoginRequestSchema.parse(data);
};

export const validateAuthResponse = (data: unknown): AuthResponse => {
  return AuthResponseSchema.parse(data);
};

export const validateCreateProjectRequest = (
  data: unknown
): CreateProjectRequest => {
  return CreateProjectRequestSchema.parse(data);
};

export const validateUpdateProjectRequest = (
  data: unknown
): UpdateProjectRequest => {
  return UpdateProjectRequestSchema.parse(data);
};

export const validateCreateConfidentRequest = (
  data: unknown
): CreateConfidentRequest => {
  return CreateConfidentRequestSchema.parse(data);
};

export const validateUpdateConfidentRequest = (
  data: unknown
): UpdateConfidentRequest => {
  return UpdateConfidentRequestSchema.parse(data);
};

export const validateCreateTagRequest = (data: unknown): CreateTagRequest => {
  return CreateTagRequestSchema.parse(data);
};

export const validateUpdateTagRequest = (data: unknown): UpdateTagRequest => {
  return UpdateTagRequestSchema.parse(data);
};
