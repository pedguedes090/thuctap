import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import AuthSwitchLink from '../components/auth/AuthSwitchLink';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import PasswordField from '../components/ui/PasswordField';
import TextField from '../components/ui/TextField';
import { useAttemptLimit } from '../hooks/useAttemptLimit';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { MAX_ATTEMPTS } from '../utils/attemptLimit';
import { formatClock } from '../utils/format';
import { validatePassword, validateUsername } from '../utils/sanitize';

const validate = (values) => ({
  identifier: validateUsername(values.identifier),
  password: validatePassword(values.password),
});

export default function LoginPage() {
  const { login } = useAuth();
  const form = useForm({ initialValues: { identifier: '', password: '' }, validate });
  const limit = useAttemptLimit('login');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!limit.locked) setServerError('');
  }, [limit.locked]);

  const handleChange = (event) => {
    if (serverError) setServerError('');
    form.handleChange(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    if (!form.validateAll()) return;

    if (limit.record()) {
      setServerError(`Bạn đã thử quá ${MAX_ATTEMPTS} lần liên tiếp.`);
      return;
    }

    setSubmitting(true);
    try {
      const found = await login({
        identifier: form.values.identifier,
        password: form.values.password,
      });

      if (!found) {
        setServerError('Tên đăng nhập hoặc mật khẩu không chính xác.');
        return;
      }

      limit.clear();
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Đăng nhập"
      title="Welcome back."
      subtitle="Nhập thông tin để tiếp tục phiên làm việc của bạn."
      footer={
        <AuthSwitchLink
          to="/register"
          question="Chưa có tài khoản?"
          actionLabel="Đăng ký ngay"
        />
      }
    >
      {serverError && <Alert className="mb-5">{serverError}</Alert>}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          name="identifier"
          emphasis
          placeholder="Email hoặc tên đăng nhập"
          autoComplete="username"
          maxLength={100}
          value={form.values.identifier}
          onChange={handleChange}
          onBlur={form.handleBlur}
          error={form.errors.identifier}
        />

        <PasswordField
          name="password"
          emphasis
          placeholder="Mật khẩu"
          autoComplete="current-password"
          maxLength={64}
          value={form.values.password}
          onChange={handleChange}
          onBlur={form.handleBlur}
          error={form.errors.password}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={submitting}
          disabled={limit.locked}
          trailingIcon={ArrowRight}
          className="mt-3"
        >
          {limit.locked ? `Thử lại sau ${limit.remaining}s` : submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </Button>

        {limit.locked ? (
          <p className="pt-2 text-center text-xs font-bold text-red-700">
            Tạm khoá đến {formatClock(limit.until)}
          </p>
        ) : (
          <p className="pt-2 text-center text-xs text-slate-600">
            Quá {MAX_ATTEMPTS} lần thất bại sẽ tạm khoá 1 phút.
          </p>
        )}
      </form>
    </AuthShell>
  );
}
