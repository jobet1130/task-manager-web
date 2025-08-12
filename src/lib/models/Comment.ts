import { z } from 'zod';

// Base Comment Schema
export const CommentSchema = z.object({
  id: z.uuid(),
  task_id: z.uuid(),
  user_id: z.uuid(),
  content: z.string().min(1).max(2000),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create Comment Schema
export const CreateCommentSchema = CommentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Update Comment Schema
export const UpdateCommentSchema = CommentSchema.omit({
  id: true,
  task_id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
}).partial();

// Comment with user details
export const CommentWithUserSchema = CommentSchema.extend({
  user_name: z.string(),
  user_avatar: z.string().nullable(),
});

// Type exports
export type Comment = z.infer<typeof CommentSchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type UpdateComment = z.infer<typeof UpdateCommentSchema>;
export type CommentWithUser = z.infer<typeof CommentWithUserSchema>;