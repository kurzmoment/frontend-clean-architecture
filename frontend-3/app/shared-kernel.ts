// Re-export types from my-core for backward compatibility
export type {
  Confident,
  CreateConfidentData,
  UpdateConfidentData,
} from "./my-core";

export type { Project, CreateProjectData, UpdateProjectData } from "./my-core";

export type { Tag, CreateTagData, UpdateTagData } from "./my-core";

// Re-export common types
export type { DataError, Either, EitherAsync } from "./my-core";

// Re-export schemas from my-core
export {
  CreateConfidentSchema,
  UpdateConfidentSchema,
  FormConfidentSchema,
  CreateProjectSchema,
  UpdateProjectSchema,
  CreateTagSchema,
  UpdateTagSchema,
  FormTagSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
  RegisterFormSchema,
} from "./my-core";

// Import types for aliasing
import type {
  CreateConfidentData,
  UpdateConfidentData,
  CreateProjectData,
  UpdateProjectData,
  CreateTagData,
  UpdateTagData,
} from "./my-core";

// Alias types for backward compatibility
export type CreateConfidentRequest = CreateConfidentData;
export type UpdateConfidentRequest = UpdateConfidentData;
export type CreateProjectRequest = CreateProjectData;
export type UpdateProjectRequest = UpdateProjectData;
export type CreateTagRequest = CreateTagData;
export type UpdateTagRequest = UpdateTagData;

// User-related types (UI-specific, not in my-core)
export type User = {
  id: number;
  email: string;
  username: string;
  created_at?: string;
  updated_at?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
  message?: string;
};
