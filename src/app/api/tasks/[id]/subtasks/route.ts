import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// GET /api/tasks/[id]/subtasks - Get subtasks for a task
async function getTaskSubtasks(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `SELECT id, title, description, is_completed, created_at, updated_at
       FROM subtasks
       WHERE task_id = $1
       ORDER BY created_at ASC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
}

export const GET = withErrorHandlerParams(getTaskSubtasks);

// POST /api/tasks/[id]/subtasks - Create a new subtask
async function createSubtask(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    const { title, description, is_completed = false } = body;

    if (!title) {
      throw new ValidationError('Title is required');
    }

    // Verify task exists
    const taskCheck = await query(
      'SELECT id FROM tasks WHERE id = $1',
      [id]
    );

    if (taskCheck.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    const result = await query(
      `INSERT INTO subtasks (task_id, title, description, is_completed)
       VALUES ($1, $2, $3, $4)
       RETURNING id, task_id, title, description, is_completed, created_at, updated_at`,
      [id, title, description, is_completed]
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Subtask created successfully'
      },
      { status: 201 }
    );
}

export const POST = withErrorHandlerParams(createSubtask);