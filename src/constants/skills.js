export const SKILL_LEVELS = [
  { id: 'basic', label: 'Cơ bản', dot: 'bg-slate-500' },
  { id: 'intermediate', label: 'Thành thạo', dot: 'bg-indigo-600' },
  { id: 'advanced', label: 'Chuyên sâu', dot: 'bg-emerald-600' },
];

export const DEFAULT_SKILL_LEVEL = 'intermediate';

export function skillLevelOf(id) {
  return SKILL_LEVELS.find((item) => item.id === id) || SKILL_LEVELS[1];
}
