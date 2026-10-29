import { kv } from '@vercel/kv';

export const USERS_INDEX = 'ds:users:index';
export const LEADERBOARD = 'ds:leaderboard';
export const SUBMISSIONS_INDEX = 'ds:submissions:index';

const userKey = (email) => `ds:user:${email}`;
const subKey = (id) => `ds:submission:${id}`;

export async function getUser(email) {
  if (!email) return null;
  return await kv.get(userKey(email));
}

export async function saveUser(user) {
  await kv.set(userKey(user.email), user);
  await kv.sadd(USERS_INDEX, user.email);
  await kv.zadd(LEADERBOARD, { score: user.xp || 0, member: user.email });
  return user;
}

export async function getAllUsers() {
  const emails = await kv.smembers(USERS_INDEX);
  if (!emails || emails.length === 0) return [];
  const users = await Promise.all(emails.map(e => getUser(e)));
  return users.filter(Boolean);
}

export async function getLeaderboard() {
  const emails = await kv.zrange(LEADERBOARD, 0, -1, { rev: true });
  if (!emails || emails.length === 0) return [];
  const users = await Promise.all(emails.map(e => getUser(e)));
  return users.filter(Boolean);
}

export async function addSubmission(sub) {
  await kv.set(subKey(sub.id), sub);
  await kv.sadd(SUBMISSIONS_INDEX, sub.id);
  return sub;
}

export async function getSubmission(id) {
  return await kv.get(subKey(id));
}

export async function saveSubmission(sub) {
  await kv.set(subKey(sub.id), sub);
  return sub;
}

export async function getAllSubmissions() {
  const ids = await kv.smembers(SUBMISSIONS_INDEX);
  if (!ids || ids.length === 0) return [];
  const subs = await Promise.all(ids.map(id => kv.get(subKey(id))));
  return subs.filter(Boolean);
}

export async function getSubmissionsByUser(email) {
  const all = await getAllSubmissions();
  return all.filter(s => s.userEmail === email);
}
