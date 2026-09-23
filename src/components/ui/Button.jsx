import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus-visible:ring-indigo-600/30',
  cta: 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-sm focus-visible:ring-amber-500/40',
  danger: 'bg-red-700 hover:bg-red-800 text-white shadow-sm focus-visible:ring-red-700/30',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus-visible:ring-indigo-600/30',
  outline:
    'bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-900 shadow-field focus-visible:ring-indigo-600/20',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-indigo-600/20',
};

const SIZES = {
  sm: 'py-2.5 px-4 text-sm rounded-lg',
  md: 'py-3.5 px-6 text-[15px] rounded-xl',
  lg: 'py-4 px-6 text-[15px] rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  trailingIcon: TrailingIcon,
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      {...props}
      type={props.type || 'button'}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.99] cursor-pointer focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? <Loader2 size={17} className="animate-spin" /> : Icon ? <Icon size={17} /> : null}
      {children}
      {!loading && TrailingIcon ? <TrailingIcon size={17} /> : null}
    </button>
  );
}
