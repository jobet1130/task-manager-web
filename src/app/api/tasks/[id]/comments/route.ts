import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/tasks/[id]/comments - Get comments for a task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await query(
      `SELECT c.id, c.content, c.created_at, c.updated_at,
              p.id as author_id, p.full_name as author_name, 
              p.email as author_email, p.avatar_url as author_avatar
       FROM comments c
       JOIN profiles p ON c.author_id = p.id
       WHERE c.task_id = $1
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM comments WHERE task_id = $1',
      [id]
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
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/tasks/[id]/comments - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content, author_id } = body;

    if (!content || !author_id) {
      return NextResponse.json(
        { success: false, error: 'Content and author_id are required' },
        { status: 400 }
      );
    }

    // Verify task exists
    const taskCheck = await query(
      'SELECT id FROM tasks WHERE id = $1',
      [id]
    );

    if (taskCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Verify author exists
    const authorCheck = await query(
      'SELECT id FROM profiles WHERE id = $1',
      [author_id]
    );

    if (authorCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Author not found' },
        { status: 404 }
      );
    }

    const result = await query(
      `INSERT INTO comments (task_id, author_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, task_id, author_id, content, created_at, updated_at`,
      [id, author_id, content]
    );

    // Get the full comment details with author info
    const commentResult = await query(
      `SELECT c.id, c.content, c.created_at, c.updated_at,
              p.id as author_id, p.full_name as author_name, 
              p.email as author_email, p.avatar_url as author_avatar
       FROM comments c
       JOIN profiles p ON c.author_id = p.id
       WHERE c.id = $1`,
      [result.rows[0].id]
    );

    return NextResponse.json(
      {
        success: true,
        data: commentResult.rows[0],
        message: 'Comment created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}