import { z } from 'zod';

// Member Role Enum
export const MemberRoleEnum = z.enum(['owner', 'admin', 'member', 'viewer']);

// Base Project Schema
export const ProjectSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(255),
  description: z.string().nullable(),
  owner_id: z.uuid(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#3B82F6'),
  is_archived: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create Project Schema
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Update Project Schema
export const UpdateProjectSchema = ProjectSchema.omit({
  id: true,
  owner_id: true,
  created_at: true,
  updated_at: true,
}).partial();

// Project with additional data (for detailed views)
export const ProjectWithStatsSchema = ProjectSchema.extend({
  member_count: z.number(),
  task_count: z.number(),
  completed_task_count: z.number(),
  owner_name: z.string().nullable(),
});

// Project Query Parameters
export const ProjectQuerySchema = z.object({
  search: z.string().optional(),
  user_id: z.uuid().optional(),
  archived: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

// Type exports
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type ProjectWithStats = z.infer<typeof ProjectWithStatsSchema>;
export type ProjectQuery = z.infer<typeof ProjectQuerySchema>;
export type MemberRole = z.infer<typeof MemberRoleEnum>;