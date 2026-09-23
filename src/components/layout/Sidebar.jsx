import React from 'react';
import { X } from 'lucide-react';
import BrandMark from '../auth/BrandMark';
import Avatar from '../ui/Avatar';
import { APP_ROUTES } from '../../constants/navigation';

export default function Sidebar({ route, open, user, onNavigate, onClose }) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        aria-label="Điều hướng chính"
        className={`animate-fade fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col overflow-y-auto bg-slate-950 px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <BrandMark tone="light" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng điều hướng"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/15 text-slate-300 transition-colors hover:border-white/40 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1.5">
          {APP_ROUTES.map(({ id, label, icon: Icon }) => {
            const active = route === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                  active
                    ? 'bg-white text-slate-950'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="mt-8 flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-4 text-left transition-colors hover:border-white/30"
        >
          <Avatar name={user?.name || user?.username} color={user?.avatarColor} size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-white">{user?.name}</span>
            <span className="block truncate text-xs text-slate-400">@{user?.username}</span>
          </span>
        </button>

        <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-slate-400">
          MOCK API · LOCALHOST:3001
        </p>
      </aside>
    </>
  );
}
