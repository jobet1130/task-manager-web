import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface AuthUser {
  userId: string;
  email: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
) as { userId: string; email: string };

    return {
      userId: decoded.userId,
      email: decoded.email
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function createAuthResponse(message: string, status: number = 401) {
  return Response.json({ error: message }, { status });
}