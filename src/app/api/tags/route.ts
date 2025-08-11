import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandler } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// GET /api/tags - Get all tags
async function getTags(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereCondition = '';
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereCondition = `WHERE name ILIKE $${paramIndex}`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryParams.push(limit, offset);

    const result = await query(
      `SELECT t.id, t.name, t.color, t.created_at,
              COUNT(DISTINCT tt.task_id) as usage_count
       FROM tags t
       LEFT JOIN task_tags tt ON t.id = tt.tag_id
       ${whereCondition}
       GROUP BY t.id, t.name, t.color, t.created_at
       ORDER BY t.name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      queryParams
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM tags ${whereCondition}`,
      queryParams.slice(0, -2) // Remove limit and offset
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(countResult.rows[0].total)
      }
    });
}

export const GET = withErrorHandler(getTags);

// POST /api/tags - Create a new tag
async function createTag(request: NextRequest) {
    const body = await request.json();
    const { name, color = '#3B82F6' } = body;

    if (!name) {
      throw new ValidationError('Name is required');
    }

    const result = await query(
      `INSERT INTO tags (name, color)
       VALUES ($1, $2)
       RETURNING id, name, color, created_at`,
      [name, color]
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Tag created successfully'
      },
      { status: 201 }
    );
}

export const POST = withErrorHandler(createTag);