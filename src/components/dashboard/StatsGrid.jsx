import React from 'react';
import { Activity, CalendarCheck, FolderGit2, Sparkles } from 'lucide-react';
import StatCell from '../ui/StatCell';
import { daysSince, formatDate } from '../../utils/format';

export default function StatsGrid({ user, stats, loading, animate = false }) {
  const cells = [
    {
      label: 'Kỹ năng',
      value: stats?.skills ?? 0,
      hint: 'Đang có trong hồ sơ của bạn',
      icon: Sparkles,
    },
    {
      label: 'Dự án',
      value: stats?.projects ?? 0,
      hint: 'Dự án tiêu biểu đã thêm',
      icon: FolderGit2,
    },
    {
      label: 'Hoạt động hôm nay',
      value: stats?.todayActivities ?? 0,
      hint: `${stats?.totalActivities ?? 0} hoạt động đã ghi nhận`,
      icon: Activity,
    },
    {
      label: 'Ngày đồng hành',
      value: daysSince(user?.createdAt),
      hint: `Tham gia ngày ${formatDate(user?.createdAt)}`,
      icon: CalendarCheck,
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border-2 border-slate-950 bg-white">
      <div className="-mb-0.5 -mr-0.5 grid sm:grid-cols-2 lg:grid-cols-4">
        {cells.map((cell, index) => (
          <StatCell
            key={cell.label}
            {...cell}
            loading={loading}
            animate={animate}
            delay={120 + index * 70}
          />
        ))}
      </div>
    </section>
  );
}
