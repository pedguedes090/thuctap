import React from 'react';
import { AlertCircle } from 'lucide-react';

const SIZES = {
  md: 'px-6 py-3.5 text-[15px] rounded-2xl',
  lg: 'px-6 py-4 text-[15px] rounded-2xl',
};

export default function TextField({
  label,
  error,
  hint,
  size = 'lg',
  emphasis = false,
  multiline = false,
  rows = 4,
  rightSlot,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name;
  const Element = multiline ? 'textarea' : 'input';

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-600"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <Element
          id={inputId}
          rows={multiline ? rows : undefined}
          className={`w-full border-2 bg-white font-medium text-slate-900 caret-indigo-600 transition-all placeholder:font-normal placeholder:text-slate-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 ${SIZES[size]} ${multiline ? 'resize-y leading-relaxed' : ''} ${rightSlot ? 'pr-14' : ''} ${
            error
              ? 'border-red-500 focus:border-red-500 animate-shake'
              : emphasis
                ? 'border-slate-900 focus:border-indigo-600'
                : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600'
          }`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {rightSlot}
      </div>

      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 pl-5 text-xs font-semibold text-red-600">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="mt-1.5 pl-5 text-xs font-medium text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
