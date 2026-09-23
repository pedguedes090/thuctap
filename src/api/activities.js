import { request } from './client';

export async function logActivity({ userId, type, message }) {
  try {
    return await request('/activities', {
      method: 'POST',
      body: {
        userId: String(userId),
        type,
        message,
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return null;
  }
}

export async function listActivities(userId, limit = 8) {
  const id = encodeURIComponent(String(userId));
  return request(`/activities?userId=${id}&_sort=createdAt&_order=desc&_limit=${limit}`);
}
