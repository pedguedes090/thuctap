import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/sanitize';

const validate = (values) => ({
  name: validateName(values.name),
  email: validateEmail(values.email),
  password: validatePassword(values.password),
  confirmPassword: validateConfirmPassword(values.confirmPassword, values.password),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const redirectRef = useRef(0);
  const { register } = useAuth();
  const form = useForm({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validate,
  });
  const limit = useAttemptLimit('register');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => () => window.clearTimeout(redirectRef.current), []);

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
    setSuccessMessage('');

    if (!form.validateAll()) return;

    if (limit.record()) {
      setServerError(`Bạn đã thử quá ${MAX_ATTEMPTS} lần liên tiếp.`);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
      });

      limit.clear();
      setSuccessMessage('Đăng ký thành công! Đang chuyển sang màn hình đăng nhập…');
      redirectRef.current = window.setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      setServerError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Đăng ký"
      title="Start here."
      subtitle="Một tài khoản cho mọi lần quay lại. Mất chưa tới một phút."
      footer={
        <AuthSwitchLink
          to="/login"
          question="Đã có tài khoản?"
          actionLabel="Đăng nhập"
        />
      }
    >
      {serverError && <Alert className="mb-5">{serverError}</Alert>}
      {successMessage && (
        <Alert tone="success" className="mb-5">
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <TextField
          name="name"
          emphasis
          size="md"
          placeholder="Họ và tên"
          autoComplete="name"
          maxLength={50}
          value={form.values.name}
          onChange={handleChange}
          onBlur={form.handleBlur}
          error={form.errors.name}
        />

        <TextField
          name="email"
          emphasis
          size="md"
          type="email"
          placeholder="Email"
          autoComplete="email"
          maxLength={100}
          value={form.values.email}
          onChange={handleChange}
          onBlur={form.handleBlur}
          error={form.errors.email}
        />

        <PasswordField
          name="password"
          emphasis
          size="md"
          placeholder="Mật khẩu (tối thiểu 6 ký tự)"
          autoComplete="new-password"
          maxLength={64}
          value={form.values.password}
          onChange={handleChange}
          onBlur={form.handleBlur}
          error={form.errors.password}
        />

        <PasswordField
          name="confirmPassword"
          emphasis
          size="md"
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          maxLength={64}
          value={form.values.confirmPassword}
          onChange={handleChange}
          onBlur={form.handleBlur}
          error={form.errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="cta"
          size="lg"
          fullWidth
          loading={submitting}
          disabled={limit.locked}
          trailingIcon={ArrowRight}
          className="mt-4"
        >
          {limit.locked ? `Thử lại sau ${limit.remaining}s` : submitting ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
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
