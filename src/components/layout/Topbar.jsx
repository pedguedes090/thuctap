import React from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import { APP_ROUTES } from '../../constants/navigation';

export default function Topbar({ user, onOpenNav, onLogout }) {
  const { pathname } = useLocation();
  const current = APP_ROUTES.find((item) => item.path === pathname) || APP_ROUTES[0];

  return (
    <header className="sticky top-0 z-20 border-b border-indigo-700 bg-indigo-600 text-white shadow-sm">
      <div className="animate-rise mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenNav}
            aria-label="Mở điều hướng"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/30 text-white transition-colors hover:border-white hover:bg-white/10 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-xl">
              {current.label}
            </p>
            <p className="truncate text-xs text-indigo-100">{current.description}</p>
          </div>
        </div>

        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}
