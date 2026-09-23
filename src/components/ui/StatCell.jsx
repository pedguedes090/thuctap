import React from 'react';

export default function StatCell({ label, value, hint, icon: Icon, loading = false, animate = false, delay = 0 }) {
  return (
    <div
      className={`border-b-2 border-r-2 border-slate-950 p-6 lg:p-7 ${animate ? 'animate-rise' : ''}`}
      style={animate ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-h-[2rem] text-xs font-bold uppercase leading-snug tracking-[0.16em] text-slate-600">
          {label}
        </p>
        {Icon && <Icon size={16} className="mt-0.5 shrink-0 text-indigo-600" />}
      </div>

      <p className="mt-5 text-[40px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-slate-950 lg:text-[44px]">
        {loading ? (
          <span className="inline-block h-9 w-14 rounded-lg bg-slate-200 align-middle" />
        ) : (
          value
        )}
      </p>

      {hint && (
        <p className="mt-3 text-sm leading-snug text-slate-500">{loading ? 'Đang tải…' : hint}</p>
      )}
    </div>
  );
}
