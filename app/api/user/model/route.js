import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getUser, saveUser } from '@/lib/db';
import { MODELS } from '@/lib/models';

export async function POST(request) {
  const token = cookies().get('session')?.value;
  const email = await verifySession(token);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { modelId } = await request.json();
  if (!MODELS[modelId]) {
    return NextResponse.json({ error: 'Karakter tidak valid.' }, { status: 400 });
  }

  const user = await getUser(email);
  if (!user) return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });

  user.modelId = modelId;
  if (!user.completedTasks[modelId]) user.completedTasks[modelId] = {};

  await saveUser(user);
  const { password, ...safe } = user;
  return NextResponse.json({ user: safe });
}
