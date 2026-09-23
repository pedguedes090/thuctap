import React from 'react';

const TONES = {
  success: 'bg-emerald-600 text-white',
  indigo: 'bg-indigo-600 text-white',
  slate: 'bg-slate-100 text-slate-700',
  outline: 'border border-slate-300 text-slate-700',
};

export default function Badge({ tone = 'slate', pulse = false, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${TONES[tone] || TONES.slate} ${className}`}
    >
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
      {children}
    </span>
  );
}
