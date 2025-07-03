import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "completed", "on-hold"]).default("active"),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
  confident_ids: z.array(z.number()).optional().default([]),
  tag_ids: z.array(z.number()).optional().default([]),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: z.number(),
});

export type CreateProjectRequest = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectRequest = z.infer<typeof UpdateProjectSchema>;
