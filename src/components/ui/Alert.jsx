import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const TONES = {
  error: { style: 'bg-red-600 text-white', icon: AlertCircle },
  success: { style: 'bg-emerald-600 text-white', icon: CheckCircle2 },
  info: { style: 'bg-slate-950 text-white', icon: Info },
};

export default function Alert({ tone = 'error', children, className = '' }) {
  const { style, icon: Icon } = TONES[tone] || TONES.error;

  return (
    <div
      role="alert"
      className={`animate-alert flex items-center gap-2 rounded-2xl px-5 py-3.5 text-xs font-semibold ${style} ${className}`}
    >
      <Icon size={16} className="shrink-0" />
      <span>{children}</span>
    </div>
  );
}
