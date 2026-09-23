import React, { useState } from 'react';
import { Check, Save } from 'lucide-react';
import Alert from '../ui/Alert';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Card from '../ui/Card';
import TextField from '../ui/TextField';
import { AVATAR_COLORS } from '../../constants/avatar';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { validateEmail, validateName } from '../../utils/sanitize';

const validate = (values) => ({
  name: validateName(values.name),
  email: validateEmail(values.email),
});

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const form = useForm({
    initialValues: {
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
    },
    validate,
  });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!form.validateAll()) return;

    setSaving(true);
    try {
      await updateProfile({
        name: form.values.name,
        email: form.values.email,
        avatarColor: form.values.avatarColor,
      });
      setStatus({ tone: 'success', message: 'Đã lưu thay đổi hồ sơ.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="Thông tin hồ sơ"
      subtitle="Tên hiển thị và email dùng để đăng nhập"
      className="lg:col-span-2"
    >
      <div className="flex items-center gap-5 border-b border-slate-200 pb-6">
        <Avatar
          name={form.values.name || user.name}
          color={form.values.avatarColor}
          size="lg"
        />
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-indigo-600">
            @{String(user.username).toUpperCase()}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Tên tài khoản được tạo tự động từ email khi đăng ký và không đổi được.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="pt-6">
        <div className="mb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Màu đại diện
          </p>
          <div className="flex flex-wrap gap-2.5">
            {AVATAR_COLORS.map((color) => {
              const active = form.values.avatarColor === color.id;

              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.label}
                  aria-label={color.label}
                  aria-pressed={active}
                  onClick={() => form.setField('avatarColor', color.id)}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-transform ${color.className} ${
                    active ? 'ring-2 ring-indigo-600 ring-offset-2' : 'hover:scale-105'
                  }`}
                >
                  {active && <Check size={16} className="text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Họ và tên"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.name}
            maxLength={50}
            placeholder="Họ và tên"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.email}
            hint="Email này cũng là tên đăng nhập của bạn"
            maxLength={100}
            placeholder="Email"
          />
        </div>

        {status && <Alert tone={status.tone} className="mt-6">{status.message}</Alert>}

        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" loading={saving} icon={Save}>
            {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
