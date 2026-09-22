import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import HeroPanel from '../components/HeroPanel';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  sanitizeText,
  sanitizeUsername
} from '../utils/sanitize';

export default function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value, allData = formData) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(value, allData.password);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (serverError) setServerError('');

    if (touched[name]) {
      const msg = validateField(name, value, updated);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }

    if (name === 'password' && touched.confirmPassword) {
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, updated);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
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
    setSuccessMessage('');

    const nErr = validateField('name', formData.name);
    const eErr = validateField('email', formData.email);
    const pErr = validateField('password', formData.password);
    const cErr = validateField('confirmPassword', formData.confirmPassword);

    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setErrors({ name: nErr, email: eErr, password: pErr, confirmPassword: cErr });

    if (nErr || eErr || pErr || cErr) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem('demo_auth_users_list') || '[]');

      const cleanName = sanitizeText(formData.name);
      const cleanEmail = sanitizeUsername(formData.email);

      const isExisting = stored.some(
        (u) => u.email && u.email.toLowerCase() === cleanEmail.toLowerCase()
      );

      setIsSubmitting(false);

      if (isExisting) {
        setServerError('Email này đã được sử dụng! Vui lòng dùng email khác hoặc đăng nhập.');
        setErrors((prev) => ({ ...prev, email: 'Email đã tồn tại' }));
        return;
      }

      const newUser = {
        name: cleanName,
        email: cleanEmail,
        username: cleanEmail.split('@')[0],
        password: formData.password
      };

      stored.push(newUser);
      localStorage.setItem('demo_auth_users_list', JSON.stringify(stored));

      setSuccessMessage('Đăng ký thành công! Đang chuyển sang màn hình Đăng nhập...');
      setTimeout(() => {
        onRegisterSuccess(newUser);
      }, 750);
    }, 350);
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-white">
        <div className="w-full max-w-[400px]">
          
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl border-2 border-indigo-600 flex items-center justify-center text-indigo-600 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">AuthStudio</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create Account</h1>
          <p className="text-sm text-slate-500 mb-7">Create an account to get started.</p>

          {/* Alert Banners */}
          {serverError && (
            <div className="mb-5 p-3 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-medium flex items-center gap-2 px-5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-medium flex items-center gap-2 px-5">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            {/* Full Name */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  maxLength={50}
                  className={`w-full px-6 py-3 text-sm rounded-full border bg-white text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                    errors.name
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 animate-shake'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                  placeholder="Full Name (tối đa 50 ký tự)"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="absolute right-5 top-3 flex items-center">
                  {touched.name && !errors.name && formData.name.trim() && (
                    <span className="text-emerald-600" title="Hợp lệ">
                      <CheckCircle2 size={18} />
                    </span>
                  )}
                </div>
              </div>
              {errors.name && (
                <div className="mt-1.5 text-xs text-red-500 font-medium pl-5 flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  maxLength={100}
                  className={`w-full px-6 py-3 text-sm rounded-full border bg-white text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                    errors.email
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 animate-shake'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                  placeholder="Email Address (tối đa 100 ký tự)"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="absolute right-5 top-3 flex items-center">
                  {touched.email && !errors.email && formData.email.trim() && (
                    <span className="text-emerald-600" title="Hợp lệ">
                      <CheckCircle2 size={18} />
                    </span>
                  )}
                </div>
              </div>
              {errors.email && (
                <div className="mt-1.5 text-xs text-red-500 font-medium pl-5 flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  maxLength={64}
                  className={`w-full px-6 py-3 text-sm rounded-full border bg-white text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                    errors.password
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 animate-shake'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                  placeholder="Password (6 - 64 ký tự)"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-5 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  maxLength={64}
                  className={`w-full px-6 py-3 text-sm rounded-full border bg-white text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                    errors.confirmPassword
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 animate-shake'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="absolute right-12 top-3 flex items-center">
                  {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword === formData.password && (
                    <span className="text-emerald-600" title="Mật khẩu khớp">
                      <CheckCircle2 size={18} />
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="absolute right-5 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="mt-1.5 text-xs text-red-500 font-medium pl-5 flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Sign Up CTA Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Creating account...' : 'Sign Up'}</span>
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
            Already have an account?{' '}
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
              className="text-indigo-600 font-semibold hover:underline ml-1"
            >
              Login
            </a>
          </div>

        </div>
      </div>

      {/* Right Hero Section */}
      <HeroPanel />
    </div>
  );
}
