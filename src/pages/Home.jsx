import React from 'react';
import { LogOut } from 'lucide-react';
import AuthShell from '../components/AuthShell';

export default function Home({ user, onLogout }) {
  const displayName = user?.name || user?.username || 'Người dùng';
  const email = user?.email || 'chưa có email';
  const username = user?.username || (email.includes('@') ? email.split('@')[0] : 'user');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <AuthShell
      eyebrow="Hồ sơ · phiên demo"
      title={displayName}
      subtitle={email}
      panelKicker="PROFILE / 03 — ĐÃ ĐĂNG NHẬP"
      panelTitle={
        <>
          Xong.
          <br />
          Đây là bạn.
        </>
      }
      panelMeta={`@${username} · đang hoạt động`}
      panelFoot="PHIÊN CỤC BỘ · LOCALSTORAGE"
      footer={
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-indigo-700 text-white font-bold text-[15px] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30"
        >
          <LogOut size={17} />
          <span>Đăng xuất</span>
        </button>
      }
    >
      <div className="flex items-center gap-4 mb-7">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white text-2xl font-extrabold flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.2em] text-indigo-600 font-bold">@{username.toUpperCase()}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Đang hoạt động
          </p>
        </div>
      </div>

      <dl className="border-t-2 border-slate-950">
        <div className="flex items-baseline justify-between gap-4 py-4 border-b border-slate-200">
          <dt className="text-sm font-medium text-slate-600">Email</dt>
          <dd className="text-[15px] font-bold text-slate-950 truncate">{email}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-4 border-b border-slate-200">
          <dt className="text-sm font-medium text-slate-600">Tên tài khoản</dt>
          <dd className="text-[15px] font-bold text-slate-950 truncate">@{username}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-sm font-medium text-slate-600">Trạng thái</dt>
          <dd className="text-[15px] font-bold text-emerald-700">Phiên cục bộ</dd>
        </div>
      </dl>
    </AuthShell>
  );
}
