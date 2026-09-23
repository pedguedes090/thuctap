import React from 'react';
import SkillGroupCard from './SkillGroupCard';
import { SKILL_LEVELS } from '../../constants/skills';

function groupByCategory(skills, categories) {
  const order = new Map(categories.map((item, index) => [item.name, index]));
  const rank = (name) => (order.has(name) ? order.get(name) : Number.MAX_SAFE_INTEGER);

  const groups = new Map();
  skills.forEach((skill) => {
    if (!groups.has(skill.category)) groups.set(skill.category, []);
    groups.get(skill.category).push(skill);
  });

  return [...groups.entries()]
    .map(([name, items]) => ({ name, items }))
    .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name, 'vi'));
}

function LevelLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-4">
      {SKILL_LEVELS.map((item) => (
        <li key={item.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className={`h-2 w-2 rounded-full ${item.dot}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[0, 1].map((key) => (
        <div key={key} className="rounded-3xl border-2 border-slate-200 bg-white p-6">
          <span className="block h-4 w-32 rounded bg-slate-200" />
          <div className="mt-4 flex flex-wrap gap-2">
            {[0, 1, 2].map((chip) => (
              <span key={chip} className="h-10 w-28 rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SkillList({ skills, categories, loading, onRemove, removingId }) {
  if (loading) return <Skeleton />;

  const groups = groupByCategory(skills, categories);

  if (groups.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-bold text-slate-950">Bạn chưa thêm kỹ năng nào</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Chọn một danh mục ở biểu mẫu phía trên, nhập tên kỹ năng và bấm “Thêm kỹ năng”. Danh mục có
          thể tự tạo nên bạn không bị giới hạn ở danh sách có sẵn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-950">
          {skills.length} kỹ năng trong {groups.length} danh mục
        </p>
        <LevelLegend />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((group, index) => (
          <SkillGroupCard
            key={group.name}
            name={group.name}
            items={group.items}
            onRemove={onRemove}
            removingId={removingId}
            delay={Math.min(index * 60, 180)}
          />
        ))}
      </div>
    </div>
  );
}
