import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/db';

export async function GET() {
  const users = await getLeaderboard();
  const safe = users.map(({ password, ...u }) => u);
  return NextResponse.json({ users: safe });
}
