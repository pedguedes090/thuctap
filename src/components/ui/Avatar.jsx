import React from 'react';
import { avatarColorClass } from '../../constants/avatar';
import { initialOf } from '../../utils/format';

const SIZES = {
  sm: 'h-9 w-9 rounded-lg text-sm',
  md: 'h-12 w-12 rounded-xl text-base',
  lg: 'h-16 w-16 rounded-2xl text-2xl',
};

export default function Avatar({ name, color, size = 'md', className = '' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-extrabold text-white ${SIZES[size] || SIZES.md} ${avatarColorClass(color)} ${className}`}
    >
      {initialOf(name)}
    </span>
  );
}
