import { z } from 'zod';

// Base Attachment Schema
export const AttachmentSchema = z.object({
  id: z.uuid(),
  task_id: z.uuid(),
  filename: z.string().min(1).max(255),
  file_url: z.string().url(),
  file_size: z.number().int().positive(),
  mime_type: z.string().max(100).nullable(),
  uploaded_by: z.uuid(),
  created_at: z.date(),
});

// Create Attachment Schema
export const CreateAttachmentSchema = AttachmentSchema.omit({
  id: true,
  created_at: true,
});

// Attachment with user details
export const AttachmentWithUserSchema = AttachmentSchema.extend({
  uploader_name: z.string(),
});

// Type exports
export type Attachment = z.infer<typeof AttachmentSchema>;
export type CreateAttachment = z.infer<typeof CreateAttachmentSchema>;
export type AttachmentWithUser = z.infer<typeof AttachmentWithUserSchema>;