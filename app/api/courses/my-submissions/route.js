import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getSubmissionsByUser } from '@/lib/db';

export async function GET() {
  const token = cookies().get('session')?.value;
  const email = await verifySession(token);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const subs = await getSubmissionsByUser(email);
  return NextResponse.json({ submissions: subs });
}
