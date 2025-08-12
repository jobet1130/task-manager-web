import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { UpdateProjectSchema } from '@/lib/models/Project';
import { verifyAuth } from '@/lib/auth';

// GET /api/projects/[id] - Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT p.*, 
              pr.full_name as owner_name,
              COUNT(DISTINCT pm.user_id) as member_count,
              COUNT(DISTINCT t.id) as task_count,
              COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_task_count
       FROM projects p
       LEFT JOIN profiles pr ON p.owner_id = pr.id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       LEFT JOIN tasks t ON p.id = t.project_id
       WHERE p.id = $1 AND (pm.user_id = $2 OR p.owner_id = $2)
       GROUP BY p.id, pr.full_name`,
      [id, user.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is owner or admin
    const permissionCheck = await query(
      `SELECT pm.role FROM project_members pm
       WHERE pm.project_id = $1 AND pm.user_id = $2 AND pm.role IN ('owner', 'admin')
       UNION
       SELECT 'owner' as role FROM projects p
       WHERE p.id = $1 AND p.owner_id = $2`,
      [id, user.userId]
    );

    if (permissionCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = UpdateProjectSchema.parse(body);

    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(value);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const result = await query(
      `UPDATE projects SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      updateValues
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is owner
    const ownerCheck = await query(
      'SELECT id FROM projects WHERE id = $1 AND owner_id = $2',
      [id, user.userId]
    );

    if (ownerCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await query('DELETE FROM projects WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}