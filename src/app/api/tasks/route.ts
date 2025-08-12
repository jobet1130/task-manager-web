import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CreateTaskSchema, TaskQuerySchema } from '@/lib/models/Task';
import { v4 as uuidv4 } from 'uuid';
import { verifyAuth } from '@/lib/auth';

// GET /api/tasks - List tasks
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = TaskQuerySchema.parse({
      project_id: searchParams.get('project_id'),
      assignee_id: searchParams.get('assignee_id'),
      creator_id: searchParams.get('creator_id'),
      status: searchParams.get('status'),
      priority: searchParams.get('priority'),
      search: searchParams.get('search'),
      due_before: searchParams.get('due_before'),
      due_after: searchParams.get('due_after'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      sort_by: searchParams.get('sort_by'),
      sort_order: searchParams.get('sort_order')
    });

    // In the GET method, update the SQL query:
    let sql = `
      SELECT t.*,
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
      WHERE (pm.user_id = $1 OR p.owner_id = $1)
    `;
    
    const params = [user.userId];
    let paramIndex = 2;

    // Add filters
    if (queryParams.project_id) {
      sql += ` AND t.project_id = $${paramIndex}`;
      params.push(queryParams.project_id);
      paramIndex++;
    }

    if (queryParams.assignee_id) {
      sql += ` AND t.assignee_id = $${paramIndex}`;
      params.push(queryParams.assignee_id);
      paramIndex++;
    }

    if (queryParams.creator_id) {
      sql += ` AND t.creator_id = $${paramIndex}`;
      params.push(queryParams.creator_id);
      paramIndex++;
    }

    if (queryParams.status) {
      sql += ` AND t.status = $${paramIndex}`;
      params.push(queryParams.status);
      paramIndex++;
    }

    if (queryParams.priority) {
      sql += ` AND t.priority = $${paramIndex}`;
      params.push(queryParams.priority);
      paramIndex++;
    }

    if (queryParams.search) {
      sql += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
      params.push(`%${queryParams.search}%`);
      paramIndex++;
    }

    if (queryParams.due_before) {
      sql += ` AND t.due_date <= $${paramIndex}`;
      params.push(queryParams.due_before);
      paramIndex++;
    }

    if (queryParams.due_after) {
      sql += ` AND t.due_date >= $${paramIndex}`;
      params.push(queryParams.due_after);
      paramIndex++;
    }

    sql += `
      GROUP BY t.id, creator.full_name, assignee.full_name, p.name
      ORDER BY t.${queryParams.sort_by} ${queryParams.sort_order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(queryParams.limit.toString(), queryParams.offset.toString()); // Convert numbers to strings

    const result = await query(sql, params);

    return NextResponse.json({
      tasks: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateTaskSchema.parse({
      ...body,
      creator_id: user.userId
    });

    // Check if user has access to the project
    const projectAccess = await query(
      `SELECT pm.user_id FROM project_members pm
       WHERE pm.project_id = $1 AND pm.user_id = $2
       UNION
       SELECT p.owner_id FROM projects p
       WHERE p.id = $1 AND p.owner_id = $2`,
      [validatedData.project_id, user.userId]
    );

    if (projectAccess.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const taskId = uuidv4();
    const result = await query(
      `INSERT INTO tasks (id, title, description, project_id, creator_id, assignee_id, status, priority, due_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [
        taskId,
        validatedData.title,
        validatedData.description,
        validatedData.project_id,
        validatedData.creator_id,
        validatedData.assignee_id,
        validatedData.status,
        validatedData.priority,
        validatedData.due_date ? validatedData.due_date.toISOString() : null // Convert Date to string
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}