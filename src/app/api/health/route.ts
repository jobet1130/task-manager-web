import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';

export async function GET() {
  try {
    const dbStatus = await healthCheck();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      version: '1.0.0'
    });
  } catch  {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'error',
        error: 'Database connection failed'
      },
      { status: 503 }
    );
  }
}