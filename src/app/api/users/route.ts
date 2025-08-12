import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ProfileQuerySchema } from '@/lib/models/Profile';
import { verifyAuth } from '@/lib/auth';

// GET /api/users - List users
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = ProfileQuerySchema.parse({
      search: searchParams.get('search'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    });

    let sql = `
      SELECT id, email, full_name, avatar_url, created_at, updated_at
      FROM profiles
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    if (queryParams.search) {
      sql += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${queryParams.search}%`);
      paramIndex++;
    }

    sql += `
      ORDER BY full_name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(queryParams.limit.toString(), queryParams.offset.toString());

    const result = await query(sql, params);

    return NextResponse.json({
      users: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}