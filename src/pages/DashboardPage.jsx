import React, { useCallback, useEffect, useState } from 'react';
import { PencilLine } from 'lucide-react';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import StatsGrid from '../components/dashboard/StatsGrid';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import { listActivities } from '../api/activities';
import { fetchDashboardStats } from '../api/stats';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/format';
import { markArrivalPlayed, shouldPlayArrival } from '../utils/motion';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playArrival] = useState(() => shouldPlayArrival());

  useEffect(() => {
    if (playArrival) markArrivalPlayed();
  }, [playArrival]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [nextStats, nextActivities] = await Promise.all([
        fetchDashboardStats(user.id),
        listActivities(user.id, 6),
      ]);
      setStats(nextStats);
      setActivities(nextActivities);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <WelcomeBanner user={user} animate={playArrival} />

      {error && (
        <Alert className="flex-wrap justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={load}
            className="cursor-pointer font-bold underline underline-offset-4"
          >
            Thử lại
          </button>
        </Alert>
      )}

      <StatsGrid user={user} stats={stats} loading={loading} animate={playArrival} />

      <div className="grid gap-8 lg:grid-cols-3">
        <ActivityFeed activities={activities} loading={loading} animate={playArrival} />

        <Card title="Tài khoản" subtitle="Thông tin đang dùng để đăng nhập">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} color={user.avatarColor} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950">{user.name}</p>
              <p className="truncate text-xs text-slate-500">@{user.username}</p>
            </div>
          </div>

          <dl className="mt-5 border-t border-slate-200">
            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3">
              <dt className="text-sm text-slate-600">Email</dt>
              <dd className="truncate text-sm font-bold text-slate-950">{user.email}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-slate-600">Đăng nhập gần nhất</dt>
              <dd className="text-sm font-bold tabular-nums text-slate-950">
                {formatDateTime(user.lastLoginAt)}
              </dd>
            </div>
          </dl>

          <Button
            variant="outline"
            fullWidth
            icon={PencilLine}
            className="mt-5"
            onClick={() => onNavigate('profile')}
          >
            Chỉnh sửa hồ sơ
          </Button>
        </Card>
      </div>
    </div>
  );
}
