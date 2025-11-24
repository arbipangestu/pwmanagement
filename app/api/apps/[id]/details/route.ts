import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { decryptPassword } from '@/lib/crypto';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params; // application ID

  try {
    // Verify application ownership
    const appCheck = await db.query(
        'SELECT * FROM applications WHERE id = $1 AND user_id = $2',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [id, (session.user as any).id]
    );

    if (appCheck.rowCount === 0) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const result = await db.query(
      'SELECT * FROM credentials WHERE application_id = $1 ORDER BY created_at DESC',
      [id]
    );

    const decryptedCredentials = result.rows.map(cred => ({
        ...cred,
        password: decryptPassword(cred.password)
    }));

    return NextResponse.json({
        application: appCheck.rows[0],
        credentials: decryptedCredentials
    });
  } catch (error) {
    console.error('Fetch app details error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
