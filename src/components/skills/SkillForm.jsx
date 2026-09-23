import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Card from '../ui/Card';
import TextField from '../ui/TextField';
import { DEFAULT_SKILL_LEVEL, SKILL_LEVELS } from '../../constants/skills';
import { createSkill, ensureCategory } from '../../api/skills';
import { useAuth } from '../../hooks/useAuth';
import { sanitizeText, validateCategoryName, validateSkillName } from '../../utils/sanitize';

export default function SkillForm({ categories, onCreated }) {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [newCategoryMode, setNewCategoryMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState(DEFAULT_SKILL_LEVEL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const effectiveCategory = newCategoryMode ? newCategory : category;

  const selectCategory = (value) => {
    setNewCategoryMode(false);
    setNewCategory('');
    setCategory(value);
    setErrors((current) => ({ ...current, category: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    const nextErrors = {
      category: validateCategoryName(effectiveCategory),
      name: validateSkillName(name),
    };
    setErrors(nextErrors);

    if (nextErrors.category || nextErrors.name) return;

    setSaving(true);
    try {
      await ensureCategory(effectiveCategory);
      await createSkill({
        userId: user.id,
        category: sanitizeText(effectiveCategory),
        name,
        level,
      });

      setName('');
      setNewCategory('');
      setNewCategoryMode(false);
      setStatus({ tone: 'success', message: `Đã thêm kỹ năng vào danh mục ${sanitizeText(effectiveCategory)}.` });
      onCreated();
    } catch (caught) {
      setStatus({ tone: 'error', message: caught.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="Thêm kỹ năng"
      subtitle="Chọn danh mục có sẵn hoặc tự tạo danh mục mới — danh mục không bị cố định"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Danh mục
          </p>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => {
              const active = !newCategoryMode && category === item.name;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectCategory(item.name)}
                  className={`cursor-pointer rounded-lg border px-3.5 py-2 text-sm font-bold transition-colors ${
                    active
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}

            <button
              type="button"
              aria-pressed={newCategoryMode}
              onClick={() => {
                setNewCategoryMode(true);
                setCategory('');
              }}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed px-3.5 py-2 text-sm font-bold transition-colors ${
                newCategoryMode
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-slate-300 text-slate-600 hover:border-indigo-600 hover:text-indigo-700'
              }`}
            >
              <Plus size={15} />
              Danh mục mới
            </button>
          </div>

          {newCategoryMode && (
            <TextField
              className="mt-3"
              name="newCategory"
              size="md"
              placeholder="Ví dụ: Bảo mật, Kiểm thử, Kỹ năng mềm…"
              maxLength={40}
              value={newCategory}
              error={errors.category}
              onChange={(event) => {
                setNewCategory(event.target.value);
                setErrors((current) => ({ ...current, category: '' }));
              }}
            />
          )}

          {!newCategoryMode && errors.category && (
            <p className="mt-2 pl-5 text-xs font-semibold text-red-700">{errors.category}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Tên kỹ năng"
            name="skillName"
            value={name}
            maxLength={40}
            placeholder="Ví dụ: Node.js, CI/CD, Tối ưu truy vấn SQL"
            error={errors.name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: '' }));
            }}
          />

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
              Mức độ
            </p>
            <div className="grid w-full grid-cols-3 gap-1 rounded-xl border border-slate-200 p-1 sm:inline-flex sm:w-auto sm:gap-0">
              {SKILL_LEVELS.map((item) => {
                const active = level === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLevel(item.id)}
                    className={`cursor-pointer whitespace-nowrap rounded-lg px-2 py-2 text-xs font-bold transition-colors sm:px-4 sm:text-sm ${
                      active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {status && <Alert tone={status.tone}>{status.message}</Alert>}

        <Button type="submit" loading={saving} icon={Plus}>
          {saving ? 'Đang thêm…' : 'Thêm kỹ năng'}
        </Button>
      </form>
    </Card>
  );
}
