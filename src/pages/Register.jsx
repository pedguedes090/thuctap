import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import AuthShell from '../components/AuthShell';
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

  const fields = [
    { name: 'name', type: 'text', maxLength: 50, placeholder: 'Họ và tên', showToggle: false },
    { name: 'email', type: 'email', maxLength: 100, placeholder: 'Email', showToggle: false },
    { name: 'password', type: 'password', maxLength: 64, placeholder: 'Mật khẩu (tối thiểu 6 ký tự)', showToggle: true },
    { name: 'confirmPassword', type: 'password', maxLength: 64, placeholder: 'Nhập lại mật khẩu', showToggle: true },
  ];

  const showState = { password: showPassword, confirmPassword: showConfirmPassword };
  const toggleShow = {
    password: () => setShowPassword(!showPassword),
    confirmPassword: () => setShowConfirmPassword(!showConfirmPassword),
  };

  return (
    <AuthShell
      eyebrow="Đăng ký"
      title="Start here."
      subtitle="Một tài khoản cho mọi lần quay lại. Mất chưa tới một phút."
      footer={
        <p className="text-center text-sm text-slate-700">
          Đã có tài khoản?{' '}
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
            className="text-indigo-700 font-bold underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-600"
          >
            Đăng nhập
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

      {successMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 px-5">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {fields.map((f) => (
          <div key={f.name}>
            <div className="relative">
              <input
                type={f.showToggle && showState[f.name] ? 'text' : f.type === 'password' ? 'password' : f.type}
                name={f.name}
                maxLength={f.maxLength}
                className={`w-full px-6 py-3.5 text-[15px] rounded-2xl border-2 bg-white text-slate-900 font-medium caret-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 transition-all placeholder:text-slate-500 placeholder:font-normal ${
                  errors[f.name]
                    ? 'border-red-500 focus:border-red-500 animate-shake'
                    : 'border-slate-900 focus:border-indigo-600'
                }`}
                placeholder={f.placeholder}
                value={formData[f.name]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {f.showToggle && (
                <button
                  type="button"
                  className="absolute right-5 top-3.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 rounded-full"
                  onClick={toggleShow[f.name]}
                  title={showState[f.name] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showState[f.name] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            {errors[f.name] && (
              <p className="mt-1.5 text-xs text-red-600 font-semibold pl-5 flex items-center gap-1.5">
                <AlertCircle size={13} />
                <span>{errors[f.name]}</span>
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-indigo-700 text-white font-bold text-[15px] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-70 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}</span>
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      </form>
    </AuthShell>
  );
}
