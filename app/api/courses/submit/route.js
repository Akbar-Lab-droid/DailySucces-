import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { addSubmission, getSubmissionsByUser } from '@/lib/db';
import { COURSES } from '@/lib/courses';

export async function POST(request) {
  const token = cookies().get('session')?.value;
  const email = await verifySession(token);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { courseId, lessonId, proof } = await request.json();
  if (!courseId || !lessonId || !proof || proof.trim().length < 10) {
    return NextResponse.json({ error: 'Bukti minimal 10 karakter.' }, { status: 400 });
  }

  const course = COURSES.find((c) => c.id === courseId);
  if (!course) return NextResponse.json({ error: 'Course tidak valid.' }, { status: 400 });
  const lesson = course.lessons.find((l) => l.id === lessonId);
  if (!lesson) return NextResponse.json({ error: 'Pelajaran tidak valid.' }, { status: 400 });

  const existing = await getSubmissionsByUser(email);
  if (existing.some((s) => s.courseId === courseId && s.lessonId === lessonId && s.status === 'pending')) {
    return NextResponse.json({ error: 'Bukti untuk pelajaran ini sedang menunggu verifikasi.' }, { status: 409 });
  }

  const sub = {
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userEmail: email,
    courseId,
    lessonId,
    proof: proof.trim(),
    submittedAt: Date.now(),
    status: 'pending',
    reviewedAt: null,
  };

  await addSubmission(sub);
  return NextResponse.json({ submission: sub });
}
