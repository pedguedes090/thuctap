import React from 'react';
import { ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/format';

function linkLabel(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, '');
  } catch {
    return link;
  }
}

export default function ProjectCard({ project, onRemove, removing, delay = 0 }) {
  return (
    <article
      className={`animate-list flex flex-col rounded-2xl border-2 bg-white transition-all duration-150 ${
        removing ? 'scale-[0.98] border-slate-300 opacity-40' : 'border-slate-200'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-extrabold leading-tight tracking-[-0.015em] text-slate-900">
            {project.name}
          </h2>
          {project.role && (
            <p className="mt-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-indigo-600">
              {project.role.toUpperCase()}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(project.id)}
          disabled={removing}
          aria-label={`Xoá dự án ${project.name}`}
          title={`Xoá ${project.name}`}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600/20 disabled:opacity-60"
        >
          {removing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-6 py-5">
        {project.description && (
          <p className="text-sm leading-relaxed text-slate-600">{project.description}</p>
        )}

        {project.tech?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <li
                key={item}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4">
        <span className="text-xs tabular-nums text-slate-600">{formatDate(project.createdAt)}</span>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-600"
          >
            <ExternalLink size={14} />
            {linkLabel(project.link)}
          </a>
        )}
      </footer>
    </article>
  );
}
