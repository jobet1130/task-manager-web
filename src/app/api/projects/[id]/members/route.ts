import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// GET /api/projects/[id]/members - Get project members
async function getProjectMembers(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `SELECT pm.role, pm.joined_at,
              pr.id, pr.email, pr.full_name, pr.avatar_url
       FROM project_members pm
       JOIN profiles pr ON pm.user_id = pr.id
       WHERE pm.project_id = $1
       ORDER BY 
         CASE pm.role 
           WHEN 'owner' THEN 1
           WHEN 'admin' THEN 2
           WHEN 'member' THEN 3
           WHEN 'viewer' THEN 4
         END,
         pm.joined_at ASC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
}

export const GET = withErrorHandlerParams(getProjectMembers);

// POST /api/projects/[id]/members - Add a member to project
async function addProjectMember(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    const { user_id, role = 'member' } = body;

    if (!user_id) {
      throw new ValidationError('user_id is required');
    }

    // Check if user exists
    const userCheck = await query(
      'SELECT id FROM profiles WHERE id = $1',
      [user_id]
    );
    
    if (userCheck.rows.length === 0) {
      throw new NotFoundError('User');
    }

    // Check if project exists
    const projectCheck = await query(
      'SELECT id FROM projects WHERE id = $1',
      [id]
    );
    
    if (projectCheck.rows.length === 0) {
      throw new NotFoundError('Project');
    }

    await query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, user_id, role]
    );

    // Get the full member details
    const memberResult = await query(
      `SELECT pm.role, pm.joined_at,
              pr.id, pr.email, pr.full_name, pr.avatar_url
       FROM project_members pm
       JOIN profiles pr ON pm.user_id = pr.id
       WHERE pm.project_id = $1 AND pm.user_id = $2`,
      [id, user_id]
    );

    return NextResponse.json(
      {
        success: true,
        data: memberResult.rows[0],
        message: 'Member added successfully'
      },
      { status: 201 }
    );
}

export const POST = withErrorHandlerParams(addProjectMember);