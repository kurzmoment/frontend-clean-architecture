import { z } from "zod";

export const CreateConfidentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const UpdateConfidentSchema = CreateConfidentSchema.partial().extend({
  id: z.number(),
});

export const FormConfidentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type CreateConfidentRequest = z.infer<typeof CreateConfidentSchema>;
export type UpdateConfidentRequest = z.infer<typeof UpdateConfidentSchema>;
