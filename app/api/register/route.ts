import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('JSON Parse Error:', e);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error: unknown) {
    // Detailed error logging
    console.error('Registration error details:', error);

    // Type checking for the error object
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const err = error as { code: string; message?: string };
        if (err.code === '23505') { // Unique violation
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }
        // Log specific DB errors
        console.error(`DB Error Code: ${err.code}, Message: ${err.message}`);
    }

    return NextResponse.json({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
