import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandlerParams } from '@/lib/errorHandler';
import {  NotFoundError } from '@/lib/exceptions';

// GET /api/profiles/[id] - Get a specific profile
async function getProfile(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `SELECT id, email, full_name, avatar_url, created_at, updated_at
       FROM profiles
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Profile');
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
}

export const GET = withErrorHandlerParams(getProfile);

// PUT /api/profiles/[id] - Update a profile
async function updateProfile(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;
    const body = await request.json();
    const { email, full_name, avatar_url } = body;

    const result = await query(
      `UPDATE profiles
       SET email = COALESCE($2, email),
           full_name = COALESCE($3, full_name),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, full_name, avatar_url, created_at, updated_at`,
      [id, email, full_name, avatar_url]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Profile');
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Profile updated successfully'
    });
}

export const PUT = withErrorHandlerParams(updateProfile);

// DELETE /api/profiles/[id] - Delete a profile
async function deleteProfile(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
    const { id } = params;

    const result = await query(
      `DELETE FROM profiles WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Profile');
    }

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    });
}

export const DELETE = withErrorHandlerParams(deleteProfile);