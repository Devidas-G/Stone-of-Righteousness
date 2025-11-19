import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().optional(),
});

export const updateItemSchema = createItemSchema.partial();

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
