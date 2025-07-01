import { z } from "zod";
import type { Project, Confident, Tag } from "../../shared-kernel";
import { ConfidentSchema } from "./confident";
import { TagSchema } from "./tag";

// Zod schema for Project validation
export const ProjectSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  user_id: z.number().positive("User ID must be positive"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  confidents: z.array(ConfidentSchema).optional(),
  tags: z.array(TagSchema).optional(),
});

// Schema for creating a new project (without id, created_at, updated_at, confidents, tags)
export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  confident_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional(),
});

// Schema for updating a project (all fields optional except id)
export const UpdateProjectSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  confident_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional(),
});

// Domain functions for Project entity
export const createProject = (
  data: z.infer<typeof CreateProjectSchema>
): Omit<Project, "user_id"> => {
  const validatedData = CreateProjectSchema.parse(data);
  return {
    id: 0, // Will be set by the database
    name: validatedData.name,
    description: validatedData.description,
    created_at: undefined,
    updated_at: undefined,
    confidents: [],
    tags: [],
  };
};

export const hasConfident = (
  project: Project,
  confidentId: number
): boolean => {
  return (
    project.confidents?.some((confident) => confident.id === confidentId) ||
    false
  );
};

export const hasTag = (project: Project, tagId: number): boolean => {
  return project.tags?.some((tag) => tag.id === tagId) || false;
};

export const getConfidentCount = (project: Project): number => {
  return project.confidents?.length || 0;
};

export const getTagCount = (project: Project): number => {
  return project.tags?.length || 0;
};

export const addConfidentToProject = (
  project: Project,
  confident: Confident
): Project => ({
  ...project,
  confidents: [...(project.confidents || []), confident],
});

export const addTagToProject = (project: Project, tag: Tag): Project => ({
  ...project,
  tags: [...(project.tags || []), tag],
});

export const isProjectValid = (project: Project): boolean => {
  try {
    ProjectSchema.parse(project);
    return true;
  } catch {
    return false;
  }
};

export const validateProject = (data: unknown): Project => {
  return ProjectSchema.parse(data);
};

export const validateCreateProject = (
  data: unknown
): z.infer<typeof CreateProjectSchema> => {
  return CreateProjectSchema.parse(data);
};

export const validateUpdateProject = (
  data: unknown
): z.infer<typeof UpdateProjectSchema> => {
  return UpdateProjectSchema.parse(data);
};
