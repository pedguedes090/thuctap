import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';

const MENU_ITEMS = [
  { path: '/profile', label: 'Hồ sơ của tôi', icon: UserRound },
  { path: '/security', label: 'Bảo mật', icon: ShieldCheck },
];

export default function UserMenu({ user, onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleSelect = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-white/30 py-1.5 pl-1.5 pr-3 text-white transition-colors hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
      >
        <Avatar
          name={user?.name || user?.username}
          color={user?.avatarColor}
          size="sm"
          className="ring-2 ring-white/25"
        />
        <span className="hidden max-w-[140px] truncate text-sm font-bold text-white sm:block">
          {user?.name}
        </span>
        <ChevronDown
          size={16}
          className={`text-indigo-100 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-raised"
        >
          <div className="border-b border-slate-200 px-3 pb-3 pt-2">
            <p className="truncate text-sm font-bold text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-600">{user?.email}</p>
          </div>

          <div className="pt-1.5">
            {MENU_ITEMS.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(path)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Icon size={16} />
                {label}
              </button>
            ))}

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-bold text-red-700 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
