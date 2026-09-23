import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

export default function DangerZone() {
  const { user, deleteAccount } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    setDeleting(true);

    try {
      await deleteAccount();
    } catch (caught) {
      setError(caught.message);
      setDeleting(false);
    }
  };

  return (
    <Card title="Xoá tài khoản" subtitle="Tài khoản bị xoá khỏi mock API và bạn được đăng xuất ngay">
      {error && <Alert tone="error" className="mb-5">{error}</Alert>}

      {confirming ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-bold text-red-700">
            Xoá vĩnh viễn @{user.username}?
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-red-700">
            Hồ sơ và nhật ký hoạt động của tài khoản này sẽ không truy cập lại được. Không thể hoàn
            tác.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="danger" loading={deleting} icon={Trash2} onClick={handleDelete}>
              {deleting ? 'Đang xoá…' : 'Xoá tài khoản'}
            </Button>
            <Button variant="outline" disabled={deleting} onClick={() => setConfirming(false)}>
              Giữ lại tài khoản
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" icon={Trash2} onClick={() => setConfirming(true)}>
          Xoá tài khoản
        </Button>
      )}
    </Card>
  );
}
