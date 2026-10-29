import { NextResponse } from 'next/server';
import { getUser, saveUser } from '@/lib/db';
import { verifyPassword, signSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }
    const user = await getUser(email.trim().toLowerCase());
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    // Reset tugas kalau sudah beda hari
    const key = todayKey();
    if (user.lastActiveDate !== key) {
      user.completedTasks = {};
      user.lastActiveDate = key;
      await saveUser(user);
    }

    const token = await signSession(user.email);
    const response = NextResponse.json({
      user: sanitize(user),
    });
    response.cookies.set('session', token, cookieOpts());
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function sanitize(u) {
  const { password, ...rest } = u;
  return rest;
}
function cookieOpts() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };
}
