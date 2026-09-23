import React from 'react';
import { Menu } from 'lucide-react';
import UserMenu from './UserMenu';
import { APP_ROUTES } from '../../constants/navigation';

export default function Topbar({ route, user, onOpenNav, onNavigate, onLogout }) {
  const current = APP_ROUTES.find((item) => item.id === route) || APP_ROUTES[0];

  return (
    <header className="sticky top-0 z-20 border-b-2 border-slate-950 bg-white">
      <div className="animate-rise mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenNav}
            aria-label="Mở điều hướng"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-slate-200 text-slate-950 transition-colors hover:border-slate-950 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold leading-tight tracking-[-0.02em] text-slate-950 sm:text-xl">
              {current.label}
            </p>
            <p className="truncate text-xs text-slate-500">{current.description}</p>
          </div>
        </div>

        <UserMenu user={user} onNavigate={onNavigate} onLogout={onLogout} />
      </div>
    </header>
  );
}
