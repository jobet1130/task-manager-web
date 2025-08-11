import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT /api/projects/[id]/members/[userId] - Update member role
export async function PUT(
  request: NextRequest,
  context: { params: { id: string; userId: string } }
) {
  try {
    const { id, userId } = context.params;
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role is required' },
        { status: 400 }
      );
    }

    // Check if the member exists
    const memberCheck = await query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Member not found in this project' },
        { status: 404 }
      );
    }

    // Prevent changing owner role
    if (memberCheck.rows[0].role === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Cannot change owner role' },
        { status: 403 }
      );
    }

    await query(
      `UPDATE project_members
       SET role = $3
       WHERE project_id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId, role]
    );

    // Get the updated member details
    const memberResult = await query(
      `SELECT pm.role, pm.joined_at,
              pr.id, pr.email, pr.full_name, pr.avatar_url
       FROM project_members pm
       JOIN profiles pr ON pm.user_id = pr.id
       WHERE pm.project_id = $1 AND pm.user_id = $2`,
      [id, userId]
    );

    return NextResponse.json({
      success: true,
      data: memberResult.rows[0],
      message: 'Member role updated successfully'
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update member role' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/members/[userId] - Remove member from project
export async function DELETE(
  _: NextRequest,
  context: { params: { id: string; userId: string } }
) {
  try {
    const { id, userId } = context.params;

    // Check if the member exists and get their role
    const memberCheck = await query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Member not found in this project' },
        { status: 404 }
      );
    }

    // Prevent removing the owner
    if (memberCheck.rows[0].role === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Cannot remove project owner' },
        { status: 403 }
      );
    }

    const result = await query(
      `DELETE FROM project_members
       WHERE project_id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Member not found in this project' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}