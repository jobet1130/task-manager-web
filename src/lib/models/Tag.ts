import { z } from 'zod';

// Base Tag Schema
export const TagSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create Tag Schema
export const CreateTagSchema = TagSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Update Tag Schema
export const UpdateTagSchema = TagSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial();

// Tag Query Parameters
export const TagQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

// Type exports
export type Tag = z.infer<typeof TagSchema>;
export type CreateTag = z.infer<typeof CreateTagSchema>;
export type UpdateTag = z.infer<typeof UpdateTagSchema>;
export type TagQuery = z.infer<typeof TagQuerySchema>;