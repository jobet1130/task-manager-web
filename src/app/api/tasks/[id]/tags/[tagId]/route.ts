import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// DELETE /api/tasks/[id]/tags/[tagId] - Remove a tag from a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; tagId: string } }
) {
  try {
    const { id, tagId } = params;

    const result = await query(
      `DELETE FROM task_tags WHERE task_id = $1 AND tag_id = $2 RETURNING *`,
      [id, tagId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tag association not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tag removed from task successfully'
    });
  } catch (error) {
    console.error('Error removing tag from task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove tag from task' },
      { status: 500 }
    );
  }
}