import React from 'react';
import Badge from '../ui/Badge';
import { daysSince, formatDate, formatDateTime, greeting } from '../../utils/format';

export default function WelcomeBanner({ user, animate = false }) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border-2 border-slate-950 bg-indigo-700 text-white ${animate ? 'animate-rise' : ''}`}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1.3px, transparent 1.3px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-indigo-500 blur-3xl" />
      <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-800/70 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full border border-white/15 lg:block" />
      <div className="pointer-events-none absolute right-10 top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-white/10 lg:block" />

      <div className="relative p-7 sm:p-9 lg:p-11">
        <h1 className="max-w-[20ch] break-words text-[34px] font-extrabold leading-[1.03] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
          {greeting()},<br className="hidden sm:block" /> {user?.name}
        </h1>

        <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-indigo-100">
          Bạn đã đồng hành cùng AuthStudio {daysSince(user?.createdAt)} ngày. Hồ sơ, kỹ năng và dự án
          đều lưu trên mock API, mọi thay đổi được ghi lại trong nhật ký.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t-2 border-white/25 pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="success" pulse>
              Đang hoạt động
            </Badge>
            <span className="font-mono text-xs text-indigo-200">@{user?.username}</span>
          </div>

          <p className="font-mono text-xs tabular-nums text-indigo-200">
            {formatDate(new Date())} · Đăng nhập gần nhất {formatDateTime(user?.lastLoginAt)}
          </p>
        </div>
      </div>
    </section>
  );
}
