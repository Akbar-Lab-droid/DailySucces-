import { kv } from '@vercel/kv';

const hasKVConfig = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

const memoryStore = globalThis.__daily_success_store ??= {
  users: {},
  submissions: {},
};

const userKey = (email) => `ds:user:${email}`;
const subKey = (id) => `ds:submission:${id}`;

function getMemoryUsers() {
  return memoryStore.users;
}

function getMemorySubmissions() {
  return memoryStore.submissions;
}

export const USERS_INDEX = 'ds:users:index';
export const LEADERBOARD = 'ds:leaderboard';
export const SUBMISSIONS_INDEX = 'ds:submissions:index';

export async function getUser(email) {
  if (!email) return null;

  if (!hasKVConfig) {
    return getMemoryUsers()[email] ?? null;
  }

  try {
    return await kv.get(userKey(email));
  } catch {
    return getMemoryUsers()[email] ?? null;
  }
}

export async function saveUser(user) {
  if (!hasKVConfig) {
    getMemoryUsers()[user.email] = user;
    return user;
  }

  try {
    await kv.set(userKey(user.email), user);
    await kv.sadd(USERS_INDEX, user.email);
    await kv.zadd(LEADERBOARD, { score: user.xp || 0, member: user.email });
    return user;
  } catch {
    getMemoryUsers()[user.email] = user;
    return user;
  }
}

export async function getAllUsers() {
  if (!hasKVConfig) {
    return Object.values(getMemoryUsers());
  }

  try {
    const emails = await kv.smembers(USERS_INDEX);
    if (!emails || emails.length === 0) return [];
    const users = await Promise.all(emails.map((e) => getUser(e)));
    return users.filter(Boolean);
  } catch {
    return Object.values(getMemoryUsers());
  }
}

export async function getLeaderboard() {
  if (!hasKVConfig) {
    return Object.values(getMemoryUsers())
      .sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }

  try {
    const emails = await kv.zrange(LEADERBOARD, 0, -1, { rev: true });
    if (!emails || emails.length === 0) return [];
    const users = await Promise.all(emails.map((e) => getUser(e)));
    return users.filter(Boolean);
  } catch {
    return Object.values(getMemoryUsers())
      .sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }
}

export async function addSubmission(sub) {
  if (!hasKVConfig) {
    getMemorySubmissions()[sub.id] = sub;
    return sub;
  }

  try {
    await kv.set(subKey(sub.id), sub);
    await kv.sadd(SUBMISSIONS_INDEX, sub.id);
    return sub;
  } catch {
    getMemorySubmissions()[sub.id] = sub;
    return sub;
  }
}

export async function getSubmission(id) {
  if (!id) return null;

  if (!hasKVConfig) {
    return getMemorySubmissions()[id] ?? null;
  }

  try {
    return await kv.get(subKey(id));
  } catch {
    return getMemorySubmissions()[id] ?? null;
  }
}

export async function saveSubmission(sub) {
  if (!hasKVConfig) {
    getMemorySubmissions()[sub.id] = sub;
    return sub;
  }

  try {
    await kv.set(subKey(sub.id), sub);
    return sub;
  } catch {
    getMemorySubmissions()[sub.id] = sub;
    return sub;
  }
}

export async function getAllSubmissions() {
  if (!hasKVConfig) {
    return Object.values(getMemorySubmissions());
  }

  try {
    const ids = await kv.smembers(SUBMISSIONS_INDEX);
    if (!ids || ids.length === 0) return [];
    const subs = await Promise.all(ids.map((id) => kv.get(subKey(id))));
    return subs.filter(Boolean);
  } catch {
    return Object.values(getMemorySubmissions());
  }
}

export async function getSubmissionsByUser(email) {
  const all = await getAllSubmissions();
  return all.filter((s) => s.userEmail === email);
}
