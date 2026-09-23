import React from 'react';
import { Activity, KeyRound, LogIn, LogOut, PencilLine, UserPlus } from 'lucide-react';
import Card from '../ui/Card';
import { timeAgo } from '../../utils/format';

const ACTIVITY_META = {
  login: { icon: LogIn, label: 'Đăng nhập', chip: 'bg-indigo-50 text-indigo-700' },
  logout: { icon: LogOut, label: 'Đăng xuất', chip: 'bg-slate-100 text-slate-600' },
  register: { icon: UserPlus, label: 'Đăng ký', chip: 'bg-emerald-50 text-emerald-700' },
  profile: { icon: PencilLine, label: 'Hồ sơ', chip: 'bg-amber-50 text-amber-700' },
  password: { icon: KeyRound, label: 'Mật khẩu', chip: 'bg-rose-50 text-rose-700' },
};

const FALLBACK_META = { icon: Activity, label: 'Khác', chip: 'bg-slate-100 text-slate-600' };

function Skeleton() {
  return (
    <ul className="space-y-5">
      {[0, 1, 2].map((key) => (
        <li key={key} className="flex items-center gap-4">
          <span className="h-10 w-10 shrink-0 rounded-xl bg-slate-200" />
          <span className="flex-1 space-y-2">
            <span className="block h-3.5 w-2/3 rounded bg-slate-200" />
            <span className="block h-3 w-24 rounded bg-slate-100" />
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ActivityFeed({ activities, loading, animate = false }) {
  return (
    <Card
      title="Hoạt động gần đây"
      subtitle="Mỗi lần đăng nhập hoặc đổi thông tin đều được ghi lại"
      className="lg:col-span-2"
    >
      {loading ? (
        <Skeleton />
      ) : activities.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          Chưa có hoạt động nào. Hãy đăng nhập lại hoặc cập nhật hồ sơ để tạo dòng nhật ký đầu tiên.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {activities.map((item, index) => {
            const meta = ACTIVITY_META[item.type] || FALLBACK_META;
            const Icon = meta.icon;

            return (
              <li
                key={item.id}
                className={`flex items-center gap-4 py-4 first:pt-0 last:pb-0 ${animate ? 'animate-rise' : ''}`}
                style={animate ? { animationDelay: `${380 + Math.min(index * 45, 200)}ms` } : undefined}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.chip}`}
                >
                  <Icon size={17} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-950">
                    {item.message}
                  </span>
                  <span className="block text-xs tabular-nums text-slate-500">
                    {timeAgo(item.createdAt)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
