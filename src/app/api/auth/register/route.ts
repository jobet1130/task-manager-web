import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CreateProfileSchema } from '@/lib/models/Profile';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateProfileSchema.parse(body);

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM profiles WHERE email = $1',
      [validatedData.email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    // Create user
    const userId = uuidv4();
    const result = await query(
      `INSERT INTO profiles (id, email, full_name, avatar_url, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, full_name, avatar_url, created_at`,
      [
        userId,
        validatedData.email,
        validatedData.full_name,
        validatedData.avatar_url,
        passwordHash
      ]
    );

    const newUser = result.rows[0];

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          avatar_url: newUser.avatar_url,
          created_at: newUser.created_at
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}