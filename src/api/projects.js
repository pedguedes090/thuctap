import { ApiError, request } from './client';
import { sanitizeText } from '../utils/sanitize';

export async function listProjects(userId) {
  const id = encodeURIComponent(String(userId));
  return request(`/projects?userId=${id}&_sort=createdAt&_order=desc`);
}

export async function createProject({ userId, name, role, description, tech, link }) {
  const cleanName = sanitizeText(name);
  const existing = await listProjects(userId);

  if (existing.some((item) => item.name.toLowerCase() === cleanName.toLowerCase())) {
    throw new ApiError(`Dự án "${cleanName}" đã có trong danh sách của bạn.`, 409);
  }

  return request('/projects', {
    method: 'POST',
    body: {
      userId: String(userId),
      name: cleanName,
      role: sanitizeText(role),
      description: sanitizeText(description),
      tech: tech.map((item) => sanitizeText(item)),
      link: sanitizeText(link),
      createdAt: new Date().toISOString(),
    },
  });
}

export async function deleteProject(id) {
  await request(`/projects/${id}`, { method: 'DELETE' });
}
