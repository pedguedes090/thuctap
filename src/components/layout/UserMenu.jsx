import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import Avatar from '../ui/Avatar';

const MENU_ITEMS = [
  { id: 'profile', label: 'Hồ sơ của tôi', icon: UserRound },
  { id: 'security', label: 'Bảo mật', icon: ShieldCheck },
];

export default function UserMenu({ user, onNavigate, onLogout }) {
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

  const handleSelect = (route) => {
    setOpen(false);
    onNavigate(route);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-2.5 rounded-2xl border-2 border-slate-200 py-1.5 pl-1.5 pr-3 transition-colors hover:border-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20"
      >
        <Avatar name={user?.name || user?.username} color={user?.avatarColor} size="sm" />
        <span className="hidden max-w-[140px] truncate text-sm font-bold text-slate-950 sm:block">
          {user?.name}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-60 rounded-2xl border-2 border-slate-950 bg-white p-1.5"
        >
          <div className="border-b border-slate-200 px-3 pb-3 pt-2">
            <p className="truncate text-sm font-bold text-slate-950">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="pt-1.5">
            {MENU_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(id)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
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
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
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
