import React from 'react';
import DangerZone from '../components/profile/DangerZone';
import PasswordForm from '../components/profile/PasswordForm';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/format';

export default function SecurityPage() {
  const { user } = useAuth();

  const session = [
    { label: 'Thiết bị hiện tại', value: 'Trình duyệt này' },
    { label: 'Đăng nhập gần nhất', value: formatDateTime(user.lastLoginAt) },
    { label: 'Phiên lưu tại', value: 'authstudio.session' },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <PasswordForm />
        <DangerZone />
      </div>

      <Card title="Phiên đăng nhập" subtitle="Dữ liệu cục bộ trên máy bạn">
        <dl className="border-t border-slate-200">
          {session.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3"
            >
              <dt className="text-sm text-slate-600">{row.label}</dt>
              <dd className="text-right text-sm font-bold text-slate-950">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          Phiên không có thời hạn và không dùng token: đóng trình duyệt rồi mở lại vẫn đang đăng
          nhập. Dùng “Đăng xuất” để kết thúc phiên.
        </p>
      </Card>
    </div>
  );
}
