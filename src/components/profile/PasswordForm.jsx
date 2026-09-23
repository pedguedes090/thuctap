import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Card from '../ui/Card';
import PasswordField from '../ui/PasswordField';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { validateConfirmPassword, validatePassword } from '../../utils/sanitize';

const validate = (values) => ({
  currentPassword: values.currentPassword ? '' : 'Nhập mật khẩu hiện tại',
  newPassword:
    validatePassword(values.newPassword) ||
    (values.newPassword && values.newPassword === values.currentPassword
      ? 'Mật khẩu mới phải khác mật khẩu hiện tại'
      : ''),
  confirmPassword: validateConfirmPassword(values.confirmPassword, values.newPassword),
});

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function PasswordForm() {
  const { changePassword } = useAuth();
  const form = useForm({ initialValues: EMPTY, validate });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!form.validateAll()) return;

    setSaving(true);
    try {
      await changePassword({
        currentPassword: form.values.currentPassword,
        newPassword: form.values.newPassword,
      });
      form.reset(EMPTY);
      setStatus({ tone: 'success', message: 'Đã đổi mật khẩu đăng nhập.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Đổi mật khẩu" subtitle="Tối thiểu 6 ký tự, không chứa khoảng trắng">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <PasswordField
          label="Mật khẩu hiện tại"
          name="currentPassword"
          value={form.values.currentPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.currentPassword}
          maxLength={64}
          placeholder="Mật khẩu đang dùng"
        />

        <PasswordField
          label="Mật khẩu mới"
          name="newPassword"
          value={form.values.newPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.newPassword}
          maxLength={64}
          placeholder="Mật khẩu mới"
        />

        <PasswordField
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.confirmPassword}
          maxLength={64}
          placeholder="Nhập lại mật khẩu mới"
        />

        {status && <Alert tone={status.tone}>{status.message}</Alert>}

        <Button type="submit" loading={saving} icon={KeyRound}>
          {saving ? 'Đang cập nhật…' : 'Đổi mật khẩu'}
        </Button>
      </form>
    </Card>
  );
}
