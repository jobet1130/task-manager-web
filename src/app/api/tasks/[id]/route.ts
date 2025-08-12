import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { UpdateTaskSchema } from '@/lib/models/Task';
import { verifyAuth } from '@/lib/auth';

// GET /api/tasks/[id] - Get task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT t.*,
             creator.full_name as creator_name,
             assignee.full_name as assignee_name,
             p.name as project_name,
             COUNT(DISTINCT s.id) as subtask_count,
             COUNT(DISTINCT CASE WHEN s.status = 'done' THEN s.id END) as completed_subtask_count,
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT a.id) as attachment_count
      FROM tasks t
      LEFT JOIN profiles creator ON t.creator_id = creator.id
      LEFT JOIN profiles assignee ON t.assignee_id = assignee.id
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN subtasks s ON t.id = s.task_id
      LEFT JOIN comments c ON t.id = c.task_id
      LEFT JOIN attachments a ON t.id = a.task_id
      WHERE t.id = $1 AND (pm.user_id = $2 OR p.owner_id = $2)
      GROUP BY t.id, creator.full_name, assignee.full_name, p.name`,
      [params.id, user.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = UpdateTaskSchema.parse(body);

    // Check if user has access to the task
    const taskAccess = await query(
      `SELECT t.id FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE t.id = $1 AND (pm.user_id = $2 OR p.owner_id = $2 OR t.creator_id = $2 OR t.assignee_id = $2)`,
      [params.id, user.userId]
    );

    if (taskAccess.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        if (key === 'due_date' && value instanceof Date) {
          updateValues.push(value.toISOString());
        } else {
          updateValues.push(value);
        }
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(params.id);

    const result = await query(
      `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      updateValues
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete the task
    const taskAccess = await query(
      `SELECT t.id FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.id = $1 AND (p.owner_id = $2 OR t.creator_id = $2)`,
      [params.id, user.userId]
    );

    if (taskAccess.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await query('DELETE FROM tasks WHERE id = $1', [params.id]);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}