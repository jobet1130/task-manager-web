import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT /api/tasks/[id]/comments/[commentId] - Update a comment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE comments
       SET content = $3,
           updated_at = NOW()
       WHERE id = $1 AND task_id = $2
       RETURNING id, task_id, author_id, content, created_at, updated_at`,
      [commentId, id, content]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Get the full comment details with author info
    const commentResult = await query(
      `SELECT c.id, c.content, c.created_at, c.updated_at,
              p.id as author_id, p.full_name as author_name, 
              p.email as author_email, p.avatar_url as author_avatar
       FROM comments c
       JOIN profiles p ON c.author_id = p.id
       WHERE c.id = $1`,
      [commentId]
    );

    return NextResponse.json({
      success: true,
      data: commentResult.rows[0],
      message: 'Comment updated successfully'
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id]/comments/[commentId] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = params;

    const result = await query(
      `DELETE FROM comments WHERE id = $1 AND task_id = $2 RETURNING id`,
      [commentId, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}