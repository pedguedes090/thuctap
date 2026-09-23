import { ApiError, request } from './client';
import { sanitizeText } from '../utils/sanitize';

export async function listCategories() {
  return request('/categories?_sort=order&_order=asc');
}

export async function ensureCategory(name) {
  const clean = sanitizeText(name);
  const matches = await request(`/categories?q=${encodeURIComponent(clean)}`);
  const existing = matches.find((item) => item.name.toLowerCase() === clean.toLowerCase());

  if (existing) return existing;

  const all = await listCategories();

  return request('/categories', {
    method: 'POST',
    body: { name: clean, order: all.length + 1 },
  });
}

export async function listSkills(userId) {
  const id = encodeURIComponent(String(userId));
  return request(`/skills?userId=${id}&_sort=createdAt&_order=asc`);
}

export async function createSkill({ userId, category, name, level }) {
  const cleanName = sanitizeText(name);
  const cleanCategory = sanitizeText(category);
  const existing = await listSkills(userId);

  const duplicated = existing.some(
    (item) =>
      item.category.toLowerCase() === cleanCategory.toLowerCase() &&
      item.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (duplicated) {
    throw new ApiError(`Kỹ năng "${cleanName}" đã có trong danh mục ${cleanCategory}.`, 409);
  }

  return request('/skills', {
    method: 'POST',
    body: {
      userId: String(userId),
      category: cleanCategory,
      name: cleanName,
      level,
      createdAt: new Date().toISOString(),
    },
  });
}

export async function deleteSkill(id) {
  await request(`/skills/${id}`, { method: 'DELETE' });
}
