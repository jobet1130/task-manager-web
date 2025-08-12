import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CreateProjectSchema, ProjectQuerySchema } from '@/lib/models/Project';
import { v4 as uuidv4 } from 'uuid';
import { verifyAuth } from '@/lib/auth';

// GET /api/projects - List projects
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = ProjectQuerySchema.parse({
      search: searchParams.get('search'),
      user_id: searchParams.get('user_id'),
      archived: searchParams.get('archived'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    });

    let sql = `
      SELECT p.*, 
             pr.full_name as owner_name,
             COUNT(DISTINCT pm.user_id) as member_count,
             COUNT(DISTINCT t.id) as task_count,
             COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_task_count
      FROM projects p
      LEFT JOIN profiles pr ON p.owner_id = pr.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE (pm.user_id = $1 OR p.owner_id = $1)
    `;
    
    const params = [user.userId];
    let paramIndex = 2;

    if (queryParams.search) {
      sql += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${queryParams.search}%`);
      paramIndex++;
    }

    if (queryParams.archived !== undefined) {
      sql += ` AND p.is_archived = $${paramIndex}`;
      params.push(queryParams.archived.toString()); // Convert boolean to string
      paramIndex++;
    }

    sql += `
      GROUP BY p.id, pr.full_name
      ORDER BY p.updated_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(queryParams.limit.toString(), queryParams.offset.toString()); // Convert numbers to strings

    const result = await query(sql, params);

    return NextResponse.json({
      projects: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create project
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateProjectSchema.parse({
      ...body,
      owner_id: user.userId
    });

    const projectId = uuidv4();
    const result = await query(
      `INSERT INTO projects (id, name, description, owner_id, color, is_archived, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [
        projectId,
        validatedData.name,
        validatedData.description,
        validatedData.owner_id,
        validatedData.color,
        validatedData.is_archived
      ]
    );

    // Add owner as project member
    await query(
      `INSERT INTO project_members (project_id, user_id, role, joined_at)
       VALUES ($1, $2, 'owner', NOW())`,
      [projectId, user.userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}