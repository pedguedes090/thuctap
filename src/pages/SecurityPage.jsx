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
              <dt className="whitespace-nowrap text-sm text-slate-600">{row.label}</dt>
              <dd className="text-right text-sm font-bold text-slate-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
