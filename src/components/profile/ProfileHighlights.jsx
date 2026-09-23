import React, { useEffect, useMemo, useState } from 'react';
import { listProjects } from '../../api/projects';
import { listSkills } from '../../api/skills';
import Card from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

const MAX_CATEGORIES = 5;
const MAX_PROJECTS = 4;

function Rows({ items, empty }) {
  if (items.length === 0) {
    return <p className="py-2 text-sm text-slate-600">{empty}</p>;
  }

  return (
    <ul className="border-t border-slate-200">
      {items.map((item) => (
        <li
          key={item.key}
          className="flex items-center justify-between gap-4 border-b border-slate-200 py-2.5 last:border-b-0"
        >
          <span className="min-w-0 truncate text-sm font-bold text-slate-900">{item.label}</span>
          <span className="shrink-0 text-xs text-slate-600">{item.meta}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProfileHighlights() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextSkills, nextProjects] = await Promise.all([
          listSkills(user.id),
          listProjects(user.id),
        ]);
        if (!active) return;
        setSkills(nextSkills);
        setProjects(nextProjects);
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user.id]);

  const categories = useMemo(() => {
    const counts = new Map();
    skills.forEach((skill) => {
      counts.set(skill.category, (counts.get(skill.category) || 0) + 1);
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'vi'))
      .slice(0, MAX_CATEGORIES)
      .map(([name, count]) => ({ key: name, label: name, meta: `${count} kỹ năng` }));
  }, [skills]);

  const recent = useMemo(
    () =>
      projects.slice(0, MAX_PROJECTS).map((project) => ({
        key: project.id,
        label: project.name,
        meta: project.role || '—',
      })),
    [projects]
  );

  if (failed) {
    return (
      <Card
        title="Kỹ năng & dự án"
        subtitle="Đọc từ mock API"
        className="md:col-span-2"
      >
        <p className="py-2 text-sm text-slate-600">
          Chưa đọc được dữ liệu. Kiểm tra mock API rồi tải lại trang.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card
        title="Kỹ năng"
        subtitle={loading ? 'Đang tải…' : `${skills.length} kỹ năng theo danh mục`}
      >
        {loading ? (
          <p className="py-2 text-sm text-slate-600">Đang tải…</p>
        ) : (
          <Rows items={categories} empty="Chưa có kỹ năng nào trong hồ sơ." />
        )}
      </Card>

      <Card
        title="Dự án"
        subtitle={loading ? 'Đang tải…' : `${projects.length} dự án tiêu biểu`}
      >
        {loading ? (
          <p className="py-2 text-sm text-slate-600">Đang tải…</p>
        ) : (
          <Rows items={recent} empty="Chưa có dự án tiêu biểu nào." />
        )}
      </Card>
    </div>
  );
}
