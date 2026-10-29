import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdmin } from '@/lib/auth';
import { getAllSubmissions } from '@/lib/db';

export async function GET() {
  const token = cookies().get('admin_session')?.value;
  if (!(await verifyAdmin(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const subs = await getAllSubmissions();
  subs.sort((a, b) => b.submittedAt - a.submittedAt);
  return NextResponse.json({ submissions: subs });
}
