import React from 'react';
import { LogOut, Folder, CheckCircle2 } from 'lucide-react';

export default function Home({ user, onLogout }) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-12 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl border-2 border-indigo-600 flex items-center justify-center text-indigo-600 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">AuthStudio</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {initial}
          </div>
          <div className="hidden sm:block text-left mr-2">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || user?.username || 'User'}
            </div>
            <div className="text-[11px] text-slate-500">
              {user?.email || 'user@example.com'}
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            onClick={onLogout}
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

      {/* Empty State Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Folder size={32} />
          </div>

          <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-2">
            <CheckCircle2 size={16} />
            <span>Đã đăng nhập thành công</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Trang chủ (Home Page)
          </h2>
        </div>
      </main>
    </div>
  );
}
