import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// GET /api/tasks/[id]/tags - Get tags for a task
async function getTaskTags(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `SELECT t.id, t.name, t.color, t.created_at
       FROM tags t
       JOIN task_tags tt ON t.id = tt.tag_id
       WHERE tt.task_id = $1
       ORDER BY t.name`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
}

export const GET = withErrorHandlerParams(getTaskTags);

// POST /api/tasks/[id]/tags - Add a tag to a task
async function addTaskTag(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    const { tag_id } = body;

    if (!tag_id) {
      throw new ValidationError('tag_id is required');
    }

    // Verify task exists
    const taskCheck = await query(
      'SELECT id FROM tasks WHERE id = $1',
      [id]
    );

    if (taskCheck.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    // Verify tag exists
    const tagCheck = await query(
      'SELECT id FROM tags WHERE id = $1',
      [tag_id]
    );

    if (tagCheck.rows.length === 0) {
      throw new NotFoundError('Tag');
    }

    await query(
      `INSERT INTO task_tags (task_id, tag_id)
       VALUES ($1, $2)
       RETURNING *`,
      [id, tag_id]
    );

    // Get the tag details
    const tagResult = await query(
      'SELECT id, name, color, created_at FROM tags WHERE id = $1',
      [tag_id]
    );

    return NextResponse.json(
      {
        success: true,
        data: tagResult.rows[0],
        message: 'Tag added to task successfully'
      },
      { status: 201 }
    );
}

export const POST = withErrorHandlerParams(addTaskTag);