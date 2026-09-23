import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import TextField from './TextField';

export default function PasswordField({ ...props }) {
  const [visible, setVisible] = useState(false);
  const label = visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu';

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          title={label}
          aria-label={label}
          className="absolute inset-y-0 right-4 flex cursor-pointer items-center rounded-full px-1 text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}
