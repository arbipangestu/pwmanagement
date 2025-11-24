import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptPassword } from '@/lib/crypto';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { applicationId, username, password } = await req.json();

    // Verify ownership of the application
    const appCheck = await db.query(
        'SELECT id FROM applications WHERE id = $1 AND user_id = $2',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [applicationId, (session.user as any).id]
    );

    if (appCheck.rowCount === 0) {
        return NextResponse.json({ error: 'Application not found or unauthorized' }, { status: 404 });
    }

    const encryptedPassword = encryptPassword(password);

    const result = await db.query(
      'INSERT INTO credentials (application_id, username, password) VALUES ($1, $2, $3) RETURNING *',
      [applicationId, username, encryptedPassword]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Create creds error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
