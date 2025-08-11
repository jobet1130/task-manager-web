import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './exceptions';

// Error response interface
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
}

// Route context type for Next.js App Router
interface RouteContext {
  params?: Record<string, string | string[]>;
}

// Global error handler function
export function handleError(error: unknown, request?: NextRequest): NextResponse {
  console.error('API Error:', error);

  let statusCode = 500;
  let message = 'Internal server error';
  let code: string | undefined;
  let details: Record<string, unknown> = {};

  // Handle custom API errors
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = error.details ?? {};
  } else if (error instanceof Error) {
    message = error.message;
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: message,
    code,
    details: details ?? {},
    timestamp: new Date().toISOString(),
    path: request?.url
  };

  // Remove undefined fields
  Object.keys(errorResponse).forEach(key => {
    if (errorResponse[key as keyof ErrorResponse] === undefined) {
      delete errorResponse[key as keyof ErrorResponse];
    }
  });

  return NextResponse.json(errorResponse, { status: statusCode });
}

// Simple wrapper for API route handlers without params
export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      return handleError(error, request);
    }
  };
}

// Wrapper for API route handlers with context
export function withErrorHandlerContext(
  handler: (request: NextRequest, context: RouteContext) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: RouteContext): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, request);
    }
  };
}

// Async wrapper for API route handlers with params (Next.js 14+ compatible)
export function withErrorHandlerParamsAsync<T>(
  handler: (request: NextRequest, context: { params: Promise<T> }) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: { params: Promise<T> }): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, request);
    }
  };
}

// Async wrapper for API route handlers with params
export function withErrorHandlerParams<T>(
  handler: (request: NextRequest, params: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, params: T): Promise<NextResponse> => {
    try {
      return await handler(request, params);
    } catch (error) {
      return handleError(error, request);
    }
  };
}