import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { z } from 'zod';

const AddMemberSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(['member', 'admin']).default('member')
});

// GET /api/projects/[projectId]/members - Get project members
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to the project
    const projectAccess = await query(
      `SELECT pm.user_id FROM project_members pm
       WHERE pm.project_id = $1 AND pm.user_id = $2
       UNION
       SELECT p.owner_id FROM projects p
       WHERE p.id = $1 AND p.owner_id = $2`,
      [params.projectId, user.userId]
    );

    if (projectAccess.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await query(
      `SELECT pm.*, p.full_name, p.email, p.avatar_url
       FROM project_members pm
       LEFT JOIN profiles p ON pm.user_id = p.id
       WHERE pm.project_id = $1
       ORDER BY pm.role DESC, p.full_name ASC`,
      [params.projectId]
    );

    return NextResponse.json({ members: result.rows });
  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/members - Add project member
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = AddMemberSchema.parse(body);

    // Check if user is project owner or admin
    const projectAccess = await query(
      `SELECT p.owner_id FROM projects p WHERE p.id = $1 AND p.owner_id = $2
       UNION
       SELECT pm.user_id FROM project_members pm 
       WHERE pm.project_id = $1 AND pm.user_id = $2 AND pm.role = 'admin'`,
      [params.projectId, user.userId]
    );

    if (projectAccess.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await query(
      `INSERT INTO project_members (project_id, user_id, role, joined_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3
       RETURNING *`,
      [params.projectId, validatedData.user_id, validatedData.role]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Add member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}