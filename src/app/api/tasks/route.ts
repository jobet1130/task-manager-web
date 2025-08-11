import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandler } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// GET /api/tasks - Get tasks with filtering
async function getTasks(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const assigneeId = searchParams.get('assignee_id');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'DESC';

    const whereConditions = [];
    const queryParams = [];
    let paramIndex = 1;

    if (projectId) {
      whereConditions.push(`t.project_id = $${paramIndex}`);
      queryParams.push(projectId);
      paramIndex++;
    }

    if (assigneeId) {
      whereConditions.push(`t.assignee_id = $${paramIndex}`);
      queryParams.push(assigneeId);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`t.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (priority) {
      whereConditions.push(`t.priority = $${paramIndex}`);
      queryParams.push(priority);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    queryParams.push(limit, offset);

    const result = await query(
      `SELECT t.id, t.title, t.description, t.status, t.priority,
              t.due_date, t.created_at, t.updated_at,
              p.id as project_id, p.name as project_name,
              creator.id as creator_id, creator.full_name as creator_name,
              assignee.id as assignee_id, assignee.full_name as assignee_name,
              COUNT(DISTINCT s.id) as subtask_count,
              COUNT(DISTINCT c.id) as comment_count,
              COUNT(DISTINCT a.id) as attachment_count
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN profiles creator ON t.creator_id = creator.id
       LEFT JOIN profiles assignee ON t.assignee_id = assignee.id
       LEFT JOIN subtasks s ON t.id = s.task_id
       LEFT JOIN comments c ON t.id = c.task_id
       LEFT JOIN attachments a ON t.id = a.task_id
       ${whereClause}
       GROUP BY t.id, p.id, p.name, creator.id, creator.full_name, assignee.id, assignee.full_name
       ORDER BY t.${sortBy} ${sortOrder}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      queryParams
    );

    // Get total count for pagination
    const countResult = await query(
      `SELECT COUNT(DISTINCT t.id) as total
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       ${whereClause}`,
      queryParams.slice(0, -2) // Remove limit and offset
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
}

export const GET = withErrorHandler(getTasks);

// POST /api/tasks - Create a new task
async function createTask(request: NextRequest) {
    const body = await request.json();
    const {
      title,
      description,
      project_id,
      creator_id,
      assignee_id,
      status = 'todo',
      priority = 'medium',
      due_date
    } = body;

    if (!title || !project_id || !creator_id) {
      throw new ValidationError('title, project_id, and creator_id are required');
    }

    // Verify project exists
    const projectCheck = await query(
      'SELECT id FROM projects WHERE id = $1',
      [project_id]
    );

    if (projectCheck.rows.length === 0) {
      throw new NotFoundError('Project');
    }

    // Verify creator exists
    const creatorCheck = await query(
      'SELECT id FROM profiles WHERE id = $1',
      [creator_id]
    );

    if (creatorCheck.rows.length === 0) {
      throw new NotFoundError('Creator');
    }

    // Verify assignee exists if provided
    if (assignee_id) {
      const assigneeCheck = await query(
        'SELECT id FROM profiles WHERE id = $1',
        [assignee_id]
      );

      if (assigneeCheck.rows.length === 0) {
        throw new NotFoundError('Assignee');
      }
    }

    const result = await query(
      `INSERT INTO tasks (title, description, project_id, creator_id, assignee_id, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, description, project_id, creator_id, assignee_id, status, priority, due_date, created_at, updated_at`,
      [title, description, project_id, creator_id, assignee_id, status, priority, due_date]
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Task created successfully'
      },
      { status: 201 }
    );
}

export const POST = withErrorHandler(createTask);