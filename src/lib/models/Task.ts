import { z } from 'zod';

// Task Status and Priority Enums
export const TaskStatusEnum = z.enum(['todo', 'in_progress', 'review', 'done']);
export const TaskPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);

// Base Task Schema
export const TaskSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(255),
  description: z.string().nullable(),
  project_id: z.uuid(),
  creator_id: z.uuid(),
  assignee_id: z.uuid().nullable(),
  status: TaskStatusEnum,
  priority: TaskPriorityEnum,
  due_date: z.date().nullable(),
  completed_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create Task Schema
export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  completed_at: true,
  created_at: true,
  updated_at: true,
}).extend({
  due_date: z.string().datetime().optional().transform((val) => val ? new Date(val) : null),
});

// Update Task Schema
export const UpdateTaskSchema = TaskSchema.omit({
  id: true,
  creator_id: true,
  created_at: true,
  updated_at: true,
}).partial().extend({
  due_date: z.string().datetime().optional().transform((val) => val ? new Date(val) : null),
});

// Task with additional data (for detailed views)
export const TaskWithDetailsSchema = TaskSchema.extend({
  creator_name: z.string().nullable(),
  assignee_name: z.string().nullable(),
  project_name: z.string(),
  subtask_count: z.number(),
  completed_subtask_count: z.number(),
  comment_count: z.number(),
  attachment_count: z.number(),
  tags: z.array(z.object({
    id: z.uuid(),
    name: z.string(),
    color: z.string(),
  })).default([]),
});

// Task Query Parameters
export const TaskQuerySchema = z.object({
  project_id: z.uuid().optional(),
  assignee_id: z.uuid().optional(),
  creator_id: z.uuid().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  search: z.string().optional(),
  due_before: z.string().datetime().optional(),
  due_after: z.string().datetime().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  sort_by: z.enum(['created_at', 'updated_at', 'due_date', 'priority', 'title']).default('created_at'),
  sort_order: z.enum(['ASC', 'DESC']).default('DESC'),
});

// Type exports
export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type TaskWithDetails = z.infer<typeof TaskWithDetailsSchema>;
export type TaskQuery = z.infer<typeof TaskQuerySchema>;
export type TaskStatus = z.infer<typeof TaskStatusEnum>;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;