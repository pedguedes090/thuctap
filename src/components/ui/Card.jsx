import React from 'react';

const TONES = {
  solid: 'bg-white border border-slate-200 shadow-card',
  soft: 'bg-white border border-slate-200',
};

export default function Card({
  title,
  subtitle,
  action,
  tone = 'solid',
  className = '',
  bodyClassName = '',
  children,
}) {
  const hasHeader = Boolean(title || action || subtitle);

  return (
    <section className={`rounded-2xl ${TONES[tone] || TONES.solid} ${className}`}>
      {hasHeader && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="min-w-0">
            {title && (
              <h2 className="text-lg font-extrabold leading-tight tracking-[-0.015em] text-slate-900">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}

      <div className={`px-6 pb-6 ${hasHeader ? 'pt-5' : 'pt-6'} ${bodyClassName}`}>{children}</div>
    </section>
  );
}
