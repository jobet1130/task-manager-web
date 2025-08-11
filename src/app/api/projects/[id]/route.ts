import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// GET /api/projects/[id] - Get a specific project
async function getProject(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `SELECT p.id, p.name, p.description, p.color, p.is_archived,
              p.created_at, p.updated_at,
              pr.id as owner_id, pr.full_name as owner_name, pr.email as owner_email,
              COUNT(DISTINCT t.id) as task_count,
              COUNT(DISTINCT pm.user_id) as member_count
       FROM projects p
       LEFT JOIN profiles pr ON p.owner_id = pr.id
       LEFT JOIN tasks t ON p.id = t.project_id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE p.id = $1
       GROUP BY p.id, pr.id, pr.full_name, pr.email`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Project');
    }

    // Get project members
    const membersResult = await query(
      `SELECT pm.role, pm.joined_at,
              pr.id, pr.email, pr.full_name, pr.avatar_url
       FROM project_members pm
       JOIN profiles pr ON pm.user_id = pr.id
       WHERE pm.project_id = $1
       ORDER BY pm.joined_at ASC`,
      [id]
    );

    const project = {
      ...result.rows[0],
      members: membersResult.rows
    };

    return NextResponse.json({
      success: true,
      data: project
    });
}

export const GET = withErrorHandlerParams(getProject);

// PUT /api/projects/[id] - Update a project
async function updateProject(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    const { name, description, color, is_archived } = body;

    const result = await query(
      `UPDATE projects
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           color = COALESCE($4, color),
           is_archived = COALESCE($5, is_archived),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, description, owner_id, color, is_archived, created_at, updated_at`,
      [id, name, description, color, is_archived]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Project');
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Project updated successfully'
    });
}

export const PUT = withErrorHandlerParams(updateProject);

// DELETE /api/projects/[id] - Delete a project
async function deleteProject(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `DELETE FROM projects WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Project');
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
}

export const DELETE = withErrorHandlerParams(deleteProject);