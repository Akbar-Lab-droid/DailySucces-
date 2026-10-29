import { NextResponse } from 'next/server';
import { getUser, saveUser } from '@/lib/db';
import { hashPassword, signSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, religion } = await request.json();
    if (!name || !email || !password || !religion) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter.' }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await getUser(normalizedEmail);
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 409 });
    }
    const user = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
      religion,
      modelId: null,
      xp: 0,
      completedTasks: {},
      lastActiveDate: todayKey(),
      joinedAt: Date.now(),
    };
    await saveUser(user);

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
