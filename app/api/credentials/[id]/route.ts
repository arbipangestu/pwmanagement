import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptPassword } from '@/lib/crypto';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { username, password } = await req.json();

  try {
    // Verify ownership via application link
    const credCheck = await db.query(`
        SELECT c.id FROM credentials c
        JOIN applications a ON c.application_id = a.id
        WHERE c.id = $1 AND a.user_id = $2
    `, [id, (session.user as any).id]); // eslint-disable-line @typescript-eslint/no-explicit-any

    if (credCheck.rowCount === 0) return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });

    const encryptedPassword = encryptPassword(password);

    const result = await db.query(
      'UPDATE credentials SET username = $1, password = $2 WHERE id = $3 RETURNING *',
      [username, encryptedPassword, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating credential' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
     // Verify ownership via application link
     const credCheck = await db.query(`
        SELECT c.id FROM credentials c
        JOIN applications a ON c.application_id = a.id
        WHERE c.id = $1 AND a.user_id = $2
    `, [id, (session.user as any).id]); // eslint-disable-line @typescript-eslint/no-explicit-any

    if (credCheck.rowCount === 0) return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });

    await db.query('DELETE FROM credentials WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting credential' }, { status: 500 });
  }
}
