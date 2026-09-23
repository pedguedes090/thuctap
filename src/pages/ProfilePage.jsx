import React from 'react';
import ProfileForm from '../components/profile/ProfileForm';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { daysSince, formatDate, formatDateTime } from '../utils/format';

export default function ProfilePage() {
  const { user } = useAuth();

  const facts = [
    { label: 'Tên tài khoản', value: `@${user.username}` },
    { label: 'Ngày tạo', value: formatDate(user.createdAt) },
    { label: 'Đăng nhập gần nhất', value: formatDateTime(user.lastLoginAt) },
    { label: 'Ngày đồng hành', value: `${daysSince(user.createdAt)} ngày` },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <ProfileForm />

      <Card title="Tóm tắt" subtitle="Dữ liệu đọc từ mock API">
        <dl className="border-t border-slate-200">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3 last:border-b-0"
            >
              <dt className="text-sm text-slate-600">{fact.label}</dt>
              <dd className="text-right text-sm font-bold text-slate-950">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
