import React from 'react';
import { Loader2, X } from 'lucide-react';
import { skillLevelOf } from '../../constants/skills';

export default function SkillGroupCard({ name, items, onRemove, removingId, delay = 0 }) {
  return (
    <section
      className="animate-list rounded-3xl border-2 border-slate-950 bg-white"
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="flex items-baseline justify-between gap-4 border-b-2 border-slate-950 px-6 py-4">
        <h2 className="text-base font-extrabold tracking-[-0.015em] text-slate-950">{name}</h2>
        <span className="font-mono text-sm font-bold tabular-nums text-slate-950">{items.length}</span>
      </header>

      <ul className="flex flex-wrap gap-2 p-6">
        {items.map((skill) => {
          const meta = skillLevelOf(skill.level);
          const removing = removingId === skill.id;

          return (
            <li key={skill.id} className="animate-pop">
              <span
                className={`inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-1.5 pl-3 pr-1 transition-all duration-150 ${
                  removing ? 'scale-95 opacity-40' : ''
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`}
                  title={meta.label}
                  aria-label={meta.label}
                />
                <span className="text-sm font-bold text-slate-950">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(skill.id)}
                  disabled={removing}
                  aria-label={`Xoá kỹ năng ${skill.name}`}
                  title={`Xoá ${skill.name}`}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600/20 disabled:opacity-60"
                >
                  {removing ? <Loader2 size={13} className="animate-spin" /> : <X size={14} />}
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
