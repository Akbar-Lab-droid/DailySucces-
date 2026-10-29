import { SignJWT, jwtVerify } from 'jose';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-me-in-production'
);

export async function signSession(email) {
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET);
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.email || null;
  } catch {
    return null;
  }
}

export async function signAdmin() {
  return await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyAdmin(token) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.admin === true;
  } catch {
    return false;
  }
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  try {
    const hashBuf = Buffer.from(hash, 'hex');
    const inputBuf = scryptSync(password, salt, 64);
    return hashBuf.length === inputBuf.length && timingSafeEqual(hashBuf, inputBuf);
  } catch {
    return false;
  }
}
