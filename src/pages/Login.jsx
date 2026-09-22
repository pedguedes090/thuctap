import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { validateUsername, validatePassword, sanitizeUsername } from '../utils/sanitize';

export default function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return validateUsername(value);
      case 'password':
        return validatePassword(value);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverError) setServerError('');

    if (touched[name]) {
      const msg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');

    const uErr = validateField('username', formData.username);
    const pErr = validateField('password', formData.password);

    setTouched({ username: true, password: true });
    setErrors({ username: uErr, password: pErr });

    if (uErr || pErr) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem('demo_auth_users_list') || '[]');
      const defaultUsers = [
        { name: 'Demo User', email: 'demo@example.com', username: 'demo', password: 'password123' }
      ];
      const allUsers = stored.length > 0 ? stored : defaultUsers;

      const inputVal = sanitizeUsername(formData.username).toLowerCase();
      const inputPass = formData.password;
      const found = allUsers.find(
        (u) =>
          ((u.email && u.email.toLowerCase() === inputVal) ||
            (u.username && u.username.toLowerCase() === inputVal) ||
            (u.name && u.name.toLowerCase() === inputVal)) &&
          u.password === inputPass
      );

      setIsSubmitting(false);

      if (!found) {
        setServerError('Username hoặc mật khẩu không chính xác!');
        setErrors((prev) => ({ ...prev, password: 'Mật khẩu hoặc tài khoản không đúng' }));
        return;
      }

      onLoginSuccess(found);
    }, 350);
  };

  return (
    <AuthShell
      eyebrow="Đăng nhập"
      title="Welcome back."
      subtitle="Nhập thông tin để tiếp tục phiên làm việc của bạn."
      footer={
        <p className="text-center text-sm text-slate-700">
          Chưa có tài khoản?{' '}
          <a
            href="#signup"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister();
            }}
            className="text-indigo-700 font-bold underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-600"
          >
            Đăng ký ngay
          </a>
        </p>
      }
    >
      {serverError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-600 text-white text-xs font-semibold flex items-center gap-2 px-5">
          <AlertCircle size={16} className="shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <input
            type="text"
            name="username"
            maxLength={100}
            className={`w-full px-6 py-4 text-[15px] rounded-2xl border-2 bg-white text-slate-900 font-medium caret-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 transition-all placeholder:text-slate-500 placeholder:font-normal ${errors.username
                ? 'border-red-500 focus:border-red-500 animate-shake'
                : 'border-slate-900 focus:border-indigo-600'
              }`}
            placeholder="Email"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.username && (
            <p className="mt-1.5 text-xs text-red-600 font-semibold pl-5 flex items-center gap-1.5">
              <AlertCircle size={13} />
              <span>{errors.username}</span>
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              maxLength={64}
              className={`w-full px-6 py-4 text-[15px] rounded-2xl border-2 bg-white text-slate-900 font-medium caret-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 transition-all placeholder:text-slate-500 placeholder:font-normal ${errors.password
                  ? 'border-red-500 focus:border-red-500 animate-shake'
                  : 'border-slate-900 focus:border-indigo-600'
                }`}
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="button"
              className="absolute right-5 top-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 rounded-full"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600 font-semibold pl-5 flex items-center gap-1.5">
              <AlertCircle size={13} />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-indigo-700 text-white font-bold text-[15px] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-70 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      </form>
    </AuthShell>
  );
}
