import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT /api/tasks/[id]/subtasks/[subtaskId] - Update a subtask
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; subtaskId: string } }
) {
  try {
    const { id, subtaskId } = params;
    const body = await request.json();
    const { title, description, is_completed } = body;

    const result = await query(
      `UPDATE subtasks
       SET title = COALESCE($3, title),
           description = COALESCE($4, description),
           is_completed = COALESCE($5, is_completed),
           updated_at = NOW()
       WHERE id = $1 AND task_id = $2
       RETURNING id, task_id, title, description, is_completed, created_at, updated_at`,
      [subtaskId, id, title, description, is_completed]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subtask not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Subtask updated successfully'
    });
  } catch (error) {
    console.error('Error updating subtask:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subtask' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id]/subtasks/[subtaskId] - Delete a subtask
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; subtaskId: string } }
) {
  try {
    const { id, subtaskId } = params;

    const result = await query(
      `DELETE FROM subtasks WHERE id = $1 AND task_id = $2 RETURNING id`,
      [subtaskId, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subtask not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subtask deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subtask' },
      { status: 500 }
    );
  }
}