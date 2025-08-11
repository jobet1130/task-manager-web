// Custom exception classes for the Task Manager API

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: Record<string, unknown>;

  constructor(message: string, statusCode: number = 500, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 409, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string, originalError?: Error | Record<string, unknown>) {
    let statusCode = 500;
    let code = 'DATABASE_ERROR';
    let errorMessage = message;

    // Handle specific PostgreSQL errors
    if ((originalError as Record<string, unknown>)?.code) {
      switch ((originalError as Record<string, unknown>).code) {
        case '23505': // Unique violation
          statusCode = 409;
          code = 'DUPLICATE_ENTRY';
          errorMessage = 'Resource already exists';
          break;
        case '23503': // Foreign key violation
          statusCode = 400;
          code = 'INVALID_REFERENCE';
          errorMessage = 'Invalid reference to related resource';
          break;
        case '23502': // Not null violation
          statusCode = 400;
          code = 'MISSING_REQUIRED_FIELD';
          errorMessage = 'Required field is missing';
          break;
        default:
          errorMessage = 'Database operation failed';
      }
    }

    super(errorMessage, statusCode, code, originalError as Record<string, unknown>);
    this.name = 'DatabaseError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error', originalError?: Error | Record<string, unknown>) {
    super(message, 500, 'INTERNAL_ERROR', originalError as Record<string, unknown>);
    this.name = 'InternalServerError';
  }
}