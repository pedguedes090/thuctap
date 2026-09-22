import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import HeroPanel from '../components/HeroPanel';
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

  const isUsernameValid = touched.username && !errors.username && formData.username.trim().length >= 3;

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Form Section (Exact visual match to reference image) */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-white">
        <div className="w-full max-w-[400px]">
          
          {/* Logo Header (Clean icon without Pagedone text) */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl border-2 border-indigo-600 flex items-center justify-center text-indigo-600 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">AuthStudio</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-slate-500 mb-8">Welcome back! Please enter your details.</p>

          {/* Alert Banner */}
          {serverError && (
            <div className="mb-5 p-3 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-medium flex items-center gap-2 px-5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Username Field */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  maxLength={100}
                  className={`w-full px-6 py-3.5 text-sm rounded-full border bg-white text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                    errors.username
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 animate-shake'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                  placeholder="Username (tối đa 100 ký tự)"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="absolute right-5 top-3.5 flex items-center">
                  {isUsernameValid && (
                    <span className="text-emerald-600" title="Hợp lệ">
                      <CheckCircle2 size={18} />
                    </span>
                  )}
                </div>
              </div>
              {errors.username && (
                <div className="mt-1.5 text-xs text-red-500 font-medium pl-5 flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  <span>{errors.username}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  maxLength={64}
                  className={`w-full px-6 py-3.5 text-sm rounded-full border bg-white text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                    errors.password
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 animate-shake'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="mt-1.5 text-xs text-red-500 font-medium pl-5 flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Forgot Password Row */}
            <div className="flex justify-end items-center pt-1 text-xs font-semibold">
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-indigo-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login CTA Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6 text-slate-400 text-xs font-semibold tracking-wider">
            <div className="flex-1 border-b border-slate-200"></div>
            <span className="px-4">OR</span>
            <div className="flex-1 border-b border-slate-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setServerError('Tính năng đăng nhập qua Google chỉ mang tính minh họa.')}
              className="py-3 px-4 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => setServerError('Tính năng đăng nhập qua Facebook chỉ mang tính minh họa.')}
              className="py-3 px-4 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center text-sm text-slate-800">
            Don't have an account?{' '}
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister();
              }}
              className="text-indigo-600 font-semibold hover:underline ml-1"
            >
              Sign Up
            </a>
          </div>

        </div>
      </div>

      {/* Right Hero Section */}
      <HeroPanel />
    </div>
  );
}
