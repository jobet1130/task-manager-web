import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import { NotFoundError } from '@/lib/exceptions';

// GET /api/tasks/[id] - Get a specific task
async function getTask(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `SELECT t.id, t.title, t.description, t.status, t.priority,
              t.due_date, t.created_at, t.updated_at,
              p.id as project_id, p.name as project_name,
              creator.id as creator_id, creator.full_name as creator_name, creator.email as creator_email,
              assignee.id as assignee_id, assignee.full_name as assignee_name, assignee.email as assignee_email
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN profiles creator ON t.creator_id = creator.id
       LEFT JOIN profiles assignee ON t.assignee_id = assignee.id
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    // Get subtasks
    const subtasksResult = await query(
      `SELECT id, title, description, is_completed, created_at, updated_at
       FROM subtasks
       WHERE task_id = $1
       ORDER BY created_at ASC`,
      [id]
    );

    // Get tags
    const tagsResult = await query(
      `SELECT t.id, t.name, t.color
       FROM tags t
       JOIN task_tags tt ON t.id = tt.tag_id
       WHERE tt.task_id = $1
       ORDER BY t.name`,
      [id]
    );

    // Get comments
    const commentsResult = await query(
      `SELECT c.id, c.content, c.created_at, c.updated_at,
              p.id as author_id, p.full_name as author_name, p.avatar_url as author_avatar
       FROM comments c
       JOIN profiles p ON c.author_id = p.id
       WHERE c.task_id = $1
       ORDER BY c.created_at DESC`,
      [id]
    );

    // Get attachments
    const attachmentsResult = await query(
      `SELECT id, filename, file_url, file_size, uploaded_at
       FROM attachments
       WHERE task_id = $1
       ORDER BY uploaded_at DESC`,
      [id]
    );

    const task = {
      ...result.rows[0],
      subtasks: subtasksResult.rows,
      tags: tagsResult.rows,
      comments: commentsResult.rows,
      attachments: attachmentsResult.rows
    };

    return NextResponse.json({
      success: true,
      data: task
    });
}

export const GET = withErrorHandlerParams(getTask);

// PUT /api/tasks/[id] - Update a task
async function updateTask(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    const {
      title,
      description,
      assignee_id,
      status,
      priority,
      due_date
    } = body;

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
      `UPDATE tasks
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           assignee_id = COALESCE($4, assignee_id),
           status = COALESCE($5, status),
           priority = COALESCE($6, priority),
           due_date = COALESCE($7, due_date),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, title, description, project_id, creator_id, assignee_id, status, priority, due_date, created_at, updated_at`,
      [id, title, description, assignee_id, status, priority, due_date]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Task updated successfully'
    });
}

export const PUT = withErrorHandlerParams(updateTask);

// DELETE /api/tasks/[id] - Delete a task
async function deleteTask(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `DELETE FROM tasks WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
}

export const DELETE = withErrorHandlerParams(deleteTask);