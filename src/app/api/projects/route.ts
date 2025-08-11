import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandler } from '@/lib/errorHandler';
import { ValidationError } from '@/lib/exceptions';

// GET /api/projects - Get all projects
async function getProjects(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const archived = searchParams.get('archived') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = `
      SELECT p.id, p.name, p.description, p.color, p.is_archived,
             p.created_at, p.updated_at,
             pr.full_name as owner_name, pr.email as owner_email,
             COUNT(t.id) as task_count,
             COUNT(pm.user_id) as member_count
      FROM projects p
      LEFT JOIN profiles pr ON p.owner_id = pr.id
      LEFT JOIN tasks t ON p.id = t.project_id
      LEFT JOIN project_members pm ON p.id = pm.project_id
    `;
    const params: (string | number | boolean)[] = [];
    const conditions: string[] = [];

    if (userId) {
      conditions.push(`(p.owner_id = $${params.length + 1} OR pm.user_id = $${params.length + 1})`);
      params.push(userId);
    }

    if (search) {
      conditions.push(`(p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    conditions.push(`p.is_archived = $${params.length + 1}`);
    params.push(archived);

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryText += `
      GROUP BY p.id, pr.full_name, pr.email
      ORDER BY p.updated_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        limit,
        offset,
        total: result.rowCount
      }
    });
}

export const GET = withErrorHandler(getProjects);

// POST /api/projects - Create a new project
async function createProject(request: NextRequest) {
    const body = await request.json();
    const { name, description, owner_id, color } = body;

    if (!name || !owner_id) {
      throw new ValidationError('Name and owner_id are required');
    }

    // Start transaction to create project and add owner as member
    await query('BEGIN', []);
    
    try {
      // Create project
      const projectResult = await query(
        `INSERT INTO projects (name, description, owner_id, color)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, description, owner_id, color, is_archived, created_at, updated_at`,
        [name, description, owner_id, color || '#3B82F6']
      );

      const project = projectResult.rows[0];

      // Add owner as project member
      await query(
        `INSERT INTO project_members (project_id, user_id, role)
         VALUES ($1, $2, 'owner')`,
        [project.id, owner_id]
      );

      await query('COMMIT', []);

      return NextResponse.json(
        {
          success: true,
          data: project,
          message: 'Project created successfully'
        },
        { status: 201 }
      );
    } catch (error) {
      await query('ROLLBACK', []);
      throw error;
    }
}

export const POST = withErrorHandler(createProject);