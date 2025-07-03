import { z } from "zod";

export const CreateTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export const UpdateTagSchema = CreateTagSchema.partial().extend({
  id: z.number(),
});

export const FormTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional().or(z.literal("")),
});

export type CreateTagRequest = z.infer<typeof CreateTagSchema>;
export type UpdateTagRequest = z.infer<typeof UpdateTagSchema>;
