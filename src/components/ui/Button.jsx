import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-slate-950 hover:bg-indigo-700 text-white focus-visible:ring-indigo-600/30',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600/30',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:ring-indigo-600/30',
  outline:
    'bg-white border-2 border-slate-200 hover:border-slate-950 text-slate-950 focus-visible:ring-indigo-600/20',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-indigo-600/20',
};

const SIZES = {
  sm: 'py-2.5 px-4 text-sm rounded-xl',
  md: 'py-3.5 px-6 text-[15px] rounded-2xl',
  lg: 'py-4 px-6 text-[15px] rounded-2xl',
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
