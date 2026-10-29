import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getUser } from '@/lib/db';

export async function GET() {
  const token = cookies().get('session')?.value;
  const email = await verifySession(token);
  if (!email) return NextResponse.json({ user: null }, { status: 401 });
  const user = await getUser(email);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  const { password, ...safe } = user;
  return NextResponse.json({ user: safe });
}
