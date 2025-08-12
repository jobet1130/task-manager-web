import { z } from 'zod';

// Pagination Schema
export const PaginationSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  hasMore: z.boolean(),
});

// API Response Schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  pagination: PaginationSchema.optional(),
});

// Error Response Schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.string(),
  path: z.string().optional(),
});

// UUID Param Schema
export const UUIDParamSchema = z.object({
  id: z.string().uuid(),
});

// Type exports
export type Pagination = z.infer<typeof PaginationSchema>;
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
};
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type UUIDParam = z.infer<typeof UUIDParamSchema>;

export const UserReferenceSchema = z.object({
  id: z.uuid(),
});