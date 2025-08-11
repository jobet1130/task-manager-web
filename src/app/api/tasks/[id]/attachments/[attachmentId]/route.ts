import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// DELETE /api/tasks/[id]/attachments/[attachmentId] - Delete an attachment
async function deleteAttachment(
  request: NextRequest,
  { params }: { params: { id: string; attachmentId: string } }
) {
    const { id, attachmentId } = params;

    const result = await query(
      `DELETE FROM attachments WHERE id = $1 AND task_id = $2 RETURNING id, filename`,
      [attachmentId, id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Attachment');
    }

    return NextResponse.json({
      success: true,
      message: 'Attachment deleted successfully'
    });
}

export const DELETE = withErrorHandlerParams(deleteAttachment);