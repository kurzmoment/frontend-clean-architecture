import { z } from "zod";
import type { User } from "../../shared-kernel";

// Zod schema for User validation
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email("Invalid email format"),
  username: z.string().min(1, "Username is required"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Schema for creating a new user (without id, created_at, updated_at)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating a user (all fields optional except id)
export const UpdateUserSchema = UserSchema.partial().pick({
  email: true,
  username: true,
});

// Domain functions for User entity
export const createUser = (data: z.infer<typeof CreateUserSchema>): User => {
  const validatedData = CreateUserSchema.parse(data);
  return {
    ...validatedData,
    id: 0, // Will be set by the database
    created_at: undefined,
    updated_at: undefined,
  };
};

export const getUserDisplayName = (user: User): string => {
  return user.username || user.email;
};

export const isUserValid = (user: User): boolean => {
  try {
    UserSchema.parse(user);
    return true;
  } catch {
    return false;
  }
};

export const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};

export const validateCreateUser = (
  data: unknown
): z.infer<typeof CreateUserSchema> => {
  return CreateUserSchema.parse(data);
};

export const validateUpdateUser = (
  data: unknown
): z.infer<typeof UpdateUserSchema> => {
  return UpdateUserSchema.parse(data);
};
