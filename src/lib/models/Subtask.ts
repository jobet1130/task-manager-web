import { z } from 'zod';

// Base Subtask Schema
export const SubtaskSchema = z.object({
  id: z.uuid(),
  task_id: z.uuid(),
  title: z.string().min(1).max(255),
  description: z.string().nullable(),
  is_completed: z.boolean().default(false),
  completed_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create Subtask Schema
export const CreateSubtaskSchema = SubtaskSchema.omit({
  id: true,
  completed_at: true,
  created_at: true,
  updated_at: true,
});

// Update Subtask Schema
export const UpdateSubtaskSchema = SubtaskSchema.omit({
  id: true,
  task_id: true,
  created_at: true,
  updated_at: true,
}).partial();

// Type exports
export type Subtask = z.infer<typeof SubtaskSchema>;
export type CreateSubtask = z.infer<typeof CreateSubtaskSchema>;
export type UpdateSubtask = z.infer<typeof UpdateSubtaskSchema>;