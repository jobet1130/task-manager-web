import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// GET /api/tasks/[id]/attachments - Get attachments for a task
async function getTaskAttachments(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `SELECT id, filename, file_url, file_size, uploaded_at
       FROM attachments
       WHERE task_id = $1
       ORDER BY uploaded_at DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
}

export const GET = withErrorHandlerParams(getTaskAttachments);

// POST /api/tasks/[id]/attachments - Add an attachment to a task
async function addTaskAttachment(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    const { filename, file_url, file_size } = body;

    if (!filename || !file_url) {
      throw new ValidationError('filename and file_url are required');
    }

    // Verify task exists
    const taskCheck = await query(
      'SELECT id FROM tasks WHERE id = $1',
      [id]
    );

    if (taskCheck.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    const result = await query(
      `INSERT INTO attachments (task_id, filename, file_url, file_size)
       VALUES ($1, $2, $3, $4)
       RETURNING id, task_id, filename, file_url, file_size, uploaded_at`,
      [id, filename, file_url, file_size || null]
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Attachment added successfully'
      },
      { status: 201 }
    );
}

export const POST = withErrorHandlerParams(addTaskAttachment);