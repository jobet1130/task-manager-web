import { z } from 'zod';

// Base Profile Schema
export const ProfileSchema = z.object({
  id: z.uuid(),
  email: z.email().max(255),
  full_name: z.string().min(1).max(255).nullable(),
  avatar_url: z.url().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create Profile Schema (for POST requests)
export const CreateProfileSchema = ProfileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  password: z.string().min(8).max(100), // Add password for registration
});

// Update Profile Schema (for PUT/PATCH requests)
export const UpdateProfileSchema = ProfileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial();

// Login Schema
export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// Profile Query Parameters
export const ProfileQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

// Type exports
export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
export type LoginCredentials = z.infer<typeof LoginSchema>;
export type ProfileQuery = z.infer<typeof ProfileQuerySchema>;