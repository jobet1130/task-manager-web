import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withErrorHandler } from '@/lib/errorHandler';
import { ValidationError, NotFoundError } from '@/lib/exceptions';

// GET /api/profiles - Get all profiles
async function getProfiles(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = `
      SELECT id, email, full_name, avatar_url, created_at, updated_at
      FROM profiles
    `;
    const params: (string | number)[] = [];

    if (search) {
      queryText += ` WHERE full_name ILIKE $1 OR email ILIKE $1`;
      params.push(`%${search}%`);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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

export const GET = withErrorHandler(getProfiles);

// POST /api/profiles - Create a new profile
async function createProfile(request: NextRequest) {
    const body = await request.json();
    const { email, full_name, avatar_url } = body;

    if (!email || !full_name) {
      throw new ValidationError('Email and full_name are required');
    }

    const result = await query(
      `INSERT INTO profiles (email, full_name, avatar_url)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, avatar_url, created_at, updated_at`,
      [email, full_name, avatar_url]
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Profile created successfully'
      },
      { status: 201 }
    );
}

export const POST = withErrorHandler(createProfile);