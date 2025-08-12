import { z } from 'zod';
import { MemberRoleEnum } from './Project';

// Base Project Member Schema
export const ProjectMemberSchema = z.object({
  id: z.uuid(),
  project_id: z.uuid(),
  user_id: z.uuid(),
  role: MemberRoleEnum,
  joined_at: z.date(),
});

// Add Member Schema
export const AddMemberSchema = ProjectMemberSchema.omit({
  id: true,
  joined_at: true,
});

// Update Member Role Schema
export const UpdateMemberRoleSchema = z.object({
  role: MemberRoleEnum,
});

// Project Member with user details
export const ProjectMemberWithUserSchema = ProjectMemberSchema.extend({
  user_name: z.string(),
  user_email: z.string(),
  user_avatar: z.string().nullable(),
});

// Type exports
export type ProjectMember = z.infer<typeof ProjectMemberSchema>;
export type AddMember = z.infer<typeof AddMemberSchema>;
export type UpdateMemberRole = z.infer<typeof UpdateMemberRoleSchema>;
export type ProjectMemberWithUser = z.infer<typeof ProjectMemberWithUserSchema>;