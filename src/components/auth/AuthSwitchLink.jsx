import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthSwitchLink({ to, question, actionLabel }) {
  return (
    <p className="text-center text-sm text-slate-700">
      {question}{' '}
      <Link
        to={to}
        className="font-bold text-indigo-700 underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-600"
      >
        {actionLabel}
      </Link>
    </p>
  );
}
