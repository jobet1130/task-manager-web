import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import {  NotFoundError } from '@/lib/exceptions';

// GET /api/tags/[id] - Get a specific tag
async function getTag(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `SELECT t.id, t.name, t.color, t.created_at,
              COUNT(DISTINCT tt.task_id) as usage_count
       FROM tags t
       LEFT JOIN task_tags tt ON t.id = tt.tag_id
       WHERE t.id = $1
       GROUP BY t.id, t.name, t.color, t.created_at`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Tag');
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
}

export const GET = withErrorHandlerParams(getTag);

// PUT /api/tags/[id] - Update a tag
async function updateTag(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    const { name, color } = body;

    const result = await query(
      `UPDATE tags
       SET name = COALESCE($2, name),
           color = COALESCE($3, color)
       WHERE id = $1
       RETURNING id, name, color, created_at`,
      [id, name, color]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Tag');
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Tag updated successfully'
    });
}

export const PUT = withErrorHandlerParams(updateTag);

// DELETE /api/tags/[id] - Delete a tag
async function deleteTag(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `DELETE FROM tags WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Tag');
    }

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully'
    });
}

export const DELETE = withErrorHandlerParams(deleteTag);