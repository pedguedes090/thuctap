import { request } from './client';

export async function fetchDashboardStats(userId) {
  const id = encodeURIComponent(String(userId));

  const [skills, projects, activities] = await Promise.all([
    request(`/skills?userId=${id}`),
    request(`/projects?userId=${id}`),
    request(`/activities?userId=${id}`),
  ]);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return {
    skills: skills.length,
    projects: projects.length,
    totalActivities: activities.length,
    todayActivities: activities.filter((item) => new Date(item.createdAt) >= startOfDay).length,
  };
}
