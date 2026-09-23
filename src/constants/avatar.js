export const AVATAR_COLORS = [
  { id: 'indigo', label: 'Indigo', className: 'bg-indigo-600' },
  { id: 'slate', label: 'Than chì', className: 'bg-slate-950' },
  { id: 'emerald', label: 'Ngọc lục bảo', className: 'bg-emerald-600' },
  { id: 'amber', label: 'Hổ phách', className: 'bg-amber-500' },
  { id: 'rose', label: 'Hồng san hô', className: 'bg-rose-500' },
  { id: 'sky', label: 'Xanh da trời', className: 'bg-sky-500' },
];

export const DEFAULT_AVATAR_COLOR = AVATAR_COLORS[0].id;

export function avatarColorClass(id) {
  const color = AVATAR_COLORS.find((item) => item.id === id);
  return (color || AVATAR_COLORS[0]).className;
}
