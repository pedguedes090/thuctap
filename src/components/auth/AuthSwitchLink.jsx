import React from 'react';

export default function AuthSwitchLink({ question, actionLabel, onAction }) {
  return (
    <p className="text-center text-sm text-slate-700">
      {question}{' '}
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          onAction();
        }}
        className="font-bold text-indigo-700 underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-600"
      >
        {actionLabel}
      </a>
    </p>
  );
}
