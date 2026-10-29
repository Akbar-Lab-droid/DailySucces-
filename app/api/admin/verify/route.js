import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdmin } from '@/lib/auth';
import { getSubmission, saveSubmission, getUser, saveUser } from '@/lib/db';

const XP_PER_LESSON = 50;

export async function POST(request) {
  const token = cookies().get('admin_session')?.value;
  if (!(await verifyAdmin(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { submissionId, action } = await request.json();
  if (!['verify', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Action tidak valid.' }, { status: 400 });
  }

  const sub = await getSubmission(submissionId);
  if (!sub) return NextResponse.json({ error: 'Submission tidak ditemukan.' }, { status: 404 });
  if (sub.status !== 'pending') {
    return NextResponse.json({ error: 'Submission sudah direview.' }, { status: 409 });
  }

  sub.status = action === 'verify' ? 'verified' : 'rejected';
  sub.reviewedAt = Date.now();
  await saveSubmission(sub);

  if (action === 'verify') {
    const user = await getUser(sub.userEmail);
    if (user) {
      user.xp = (user.xp || 0) + XP_PER_LESSON;
      await saveUser(user);
    }
  }

  return NextResponse.json({ ok: true, submission: sub });
}
