import { ApiError, request } from './client';
import { sanitizeText, sanitizeUsername } from '../utils/sanitize';

const normalize = (value) => String(value ?? '').trim().toLowerCase();

function publicUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

async function search(term) {
  const query = sanitizeText(term);
  if (!query) return [];
  return request(`/users?q=${encodeURIComponent(query)}`);
}

async function isEmailTaken(email, excludeId = null) {
  const term = normalize(email);
  if (!term) return false;
  const matches = await search(email);
  return matches.some((user) => normalize(user.email) === term && user.id !== excludeId);
}

async function uniqueUsername(base) {
  const clean = normalize(base).replace(/[^a-z0-9._-]/g, '') || 'user';
  const matches = await search(clean);
  const taken = new Set(matches.map((user) => normalize(user.username)));

  if (!taken.has(clean)) return clean;

  let attempt = 2;
  while (taken.has(`${clean}${attempt}`)) attempt += 1;
  return `${clean}${attempt}`;
}

export async function login({ identifier, password }) {
  const matches = await search(sanitizeUsername(identifier));
  const term = normalize(sanitizeUsername(identifier));

  const found = matches.find(
    (user) =>
      [user.email, user.username].some((value) => normalize(value) === term) &&
      user.password === password
  );

  if (!found) return null;

  const updated = await request(`/users/${found.id}`, {
    method: 'PATCH',
    body: { lastLoginAt: new Date().toISOString() },
  });

  return publicUser(updated);
}

export async function register({ name, email, password }) {
  const cleanEmail = sanitizeUsername(email);

  if (await isEmailTaken(cleanEmail)) {
    throw new ApiError('Email này đã được sử dụng. Hãy đăng nhập hoặc dùng email khác.', 409);
  }

  const created = await request('/users', {
    method: 'POST',
    body: {
      name: sanitizeText(name),
      email: cleanEmail,
      username: await uniqueUsername(cleanEmail.split('@')[0]),
      password,
      avatarColor: 'indigo',
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    },
  });

  return publicUser(created);
}

export async function updateProfile(id, changes) {
  const email = changes.email ? sanitizeUsername(changes.email) : '';

  if (email && (await isEmailTaken(email, id))) {
    throw new ApiError('Email này đang thuộc về một tài khoản khác.', 409);
  }

  const body = { ...changes };
  if (body.name) body.name = sanitizeText(body.name);
  if (email) body.email = email;

  const updated = await request(`/users/${id}`, { method: 'PATCH', body });
  return publicUser(updated);
}

export async function changePassword(id, { currentPassword, newPassword }) {
  const current = await request(`/users/${id}`);

  if (current.password !== currentPassword) {
    throw new ApiError('Mật khẩu hiện tại không đúng.', 400);
  }

  await request(`/users/${id}`, { method: 'PATCH', body: { password: newPassword } });
}

export async function deleteAccount(id) {
  await request(`/users/${id}`, { method: 'DELETE' });
}
