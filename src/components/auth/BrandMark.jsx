import React from 'react';

export default function BrandMark({ tone = 'light' }) {
  const text = tone === 'light' ? 'text-white' : 'text-slate-900';
  const box =
    tone === 'light' ? 'border-white/70 text-white' : 'border-indigo-600 text-indigo-600';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 ${box}`}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <span className={`text-2xl font-extrabold tracking-tight ${text}`}>AuthStudio</span>
    </div>
  );
}
