import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdmin } from '@/lib/auth';
import { getAllUsers } from '@/lib/db';

export async function GET() {
  const token = cookies().get('admin_session')?.value;
  if (!(await verifyAdmin(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const users = await getAllUsers();
  const safe = users.map(({ password, ...u }) => u);
  return NextResponse.json({ users: safe });
}
