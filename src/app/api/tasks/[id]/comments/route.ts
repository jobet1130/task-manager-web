import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const CreateCommentSchema = z.object({
  content: z.string().min(1).max(2000)
});

// GET /api/tasks/[id]/comments - Get task comments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to the task
    const taskAccess = await query(
      `SELECT t.id FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE t.id = $1 AND (pm.user_id = $2 OR p.owner_id = $2)`,
      [params.id, user.userId]
    );

    if (taskAccess.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await query(
      `SELECT c.*, p.full_name, p.avatar_url
       FROM comments c
       LEFT JOIN profiles p ON c.user_id = p.id
       WHERE c.task_id = $1
       ORDER BY c.created_at ASC`,
      [params.id, user.userId]
    );

    return NextResponse.json({ comments: result.rows });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tasks/[id]/comments - Create comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to the task
    const taskAccess = await query(
      `SELECT t.id FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE t.id = $1 AND (pm.user_id = $2 OR p.owner_id = $2)`,
      [params.id, user.userId]
    );

    if (taskAccess.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = CreateCommentSchema.parse(body);

    const commentId = uuidv4();
    const result = await query(
      `INSERT INTO comments (id, task_id, user_id, content, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [commentId, params.id, user.userId, validatedData.content]
    );

    // Get the comment with user details
    const commentWithUser = await query(
      `SELECT c.*, p.full_name, p.avatar_url
       FROM comments c
       LEFT JOIN profiles p ON c.user_id = p.id
       WHERE c.id = $1`,
      [commentId]
    );

    return NextResponse.json(commentWithUser.rows[0], { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}