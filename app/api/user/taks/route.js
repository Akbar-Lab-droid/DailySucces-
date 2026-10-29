import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getUser, saveUser } from '@/lib/db';
import { MODELS } from '@/lib/models';

export async function POST(request) {
  const token = cookies().get('session')?.value;
  const email = await verifySession(token);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { modelId, taskId } = await request.json();
  const model = MODELS[modelId];
  if (!model) return NextResponse.json({ error: 'Model tidak valid.' }, { status: 400 });
  const task = model.tasks.find((t) => t.id === taskId);
  if (!task) return NextResponse.json({ error: 'Tugas tidak valid.' }, { status: 400 });

  const user = await getUser(email);
  if (!user) return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });

  // Reset harian
  const key = todayKey();
  if (user.lastActiveDate !== key) {
    user.completedTasks = {};
    user.lastActiveDate = key;
  }

  if (!user.completedTasks[modelId]) user.completedTasks[modelId] = {};
  const map = user.completedTasks[modelId];
  const wasDone = !!map[taskId];

  let message;
  if (wasDone) {
    delete map[taskId];
    user.xp = Math.max(0, user.xp - task.xp);
    message = `-${task.xp} XP · ${task.title}`;
  } else {
    map[taskId] = true;
    user.xp = (user.xp || 0) + task.xp;
    message = `+${task.xp} XP · ${task.title}`;
  }

  await saveUser(user);
  const { password, ...safe } = user;
  return NextResponse.json({ user: safe, message });
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
