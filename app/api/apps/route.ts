import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await db.query(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [(session.user as any).id]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch apps error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, url } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await db.query(
      'INSERT INTO applications (user_id, name, url) VALUES ($1, $2, $3) RETURNING *',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [(session.user as any).id, name, url]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Create app error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
