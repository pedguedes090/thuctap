import React, { useState } from 'react';
import { FolderPlus, Plus, X } from 'lucide-react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Card from '../ui/Card';
import TextField from '../ui/TextField';
import { createProject } from '../../api/projects';
import { useAuth } from '../../hooks/useAuth';
import {
  sanitizeText,
  validateProjectDescription,
  validateProjectLink,
  validateProjectName,
  validateProjectRole,
  validateTechTag,
} from '../../utils/sanitize';

const EMPTY = { name: '', role: '', link: '', description: '' };

export default function ProjectForm({ onCreated }) {
  const { user } = useAuth();
  const [values, setValues] = useState(EMPTY);
  const [tech, setTech] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const addTech = () => {
    const clean = sanitizeText(techInput);
    const error = validateTechTag(clean);

    if (error) {
      setErrors((current) => ({ ...current, tech: error }));
      return;
    }

    if (tech.some((item) => item.toLowerCase() === clean.toLowerCase())) {
      setErrors((current) => ({ ...current, tech: 'Công nghệ này đã có trong danh sách.' }));
      return;
    }

    setTech((current) => [...current, clean]);
    setTechInput('');
    setErrors((current) => ({ ...current, tech: '' }));
  };

  const handleTechKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    addTech();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    const nextErrors = {
      name: validateProjectName(values.name),
      role: validateProjectRole(values.role),
      description: validateProjectDescription(values.description),
      link: validateProjectLink(values.link),
      tech: '',
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    setSaving(true);
    try {
      await createProject({
        userId: user.id,
        name: values.name,
        role: values.role,
        description: values.description,
        tech,
        link: values.link,
      });

      setValues(EMPTY);
      setTech([]);
      setTechInput('');
      setStatus({ tone: 'success', message: `Đã thêm dự án "${sanitizeText(values.name)}".` });
      onCreated();
    } catch (caught) {
      setStatus({ tone: 'error', message: caught.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="Thêm dự án tiêu biểu"
      subtitle="Chỉ tên dự án là bắt buộc, các ô còn lại có thể bỏ trống"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Tên dự án"
            name="projectName"
            value={values.name}
            maxLength={80}
            placeholder="Ví dụ: AuthStudio"
            error={errors.name}
            onChange={(event) => setValue('name', event.target.value)}
          />

          <TextField
            label="Vai trò"
            name="projectRole"
            value={values.role}
            maxLength={60}
            placeholder="Ví dụ: Full-stack Developer"
            error={errors.role}
            onChange={(event) => setValue('role', event.target.value)}
          />
        </div>

        <TextField
          label="Mô tả"
          name="projectDescription"
          value={values.description}
          multiline
          rows={3}
          maxLength={300}
          placeholder="Dự án làm gì, bạn phụ trách phần nào, kết quả ra sao…"
          error={errors.description}
          hint={`${values.description.length}/300 ký tự`}
          onChange={(event) => setValue('description', event.target.value)}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
              Công nghệ sử dụng
            </p>

            <div className="flex items-start gap-3">
              <TextField
                className="flex-1"
                name="techInput"
                size="md"
                value={techInput}
                maxLength={30}
                placeholder="Nhập rồi bấm Enter"
                error={errors.tech}
                onChange={(event) => {
                  setTechInput(event.target.value);
                  setErrors((current) => ({ ...current, tech: '' }));
                }}
                onKeyDown={handleTechKeyDown}
              />

              <Button variant="outline" size="md" icon={Plus} className="shrink-0" onClick={addTech}>
                Thêm
              </Button>
            </div>

            {tech.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {tech.map((item) => (
                  <li key={item}>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 py-1.5 pl-3 pr-1">
                      <span className="text-sm font-bold text-slate-900">{item}</span>
                      <button
                        type="button"
                        aria-label={`Xoá công nghệ ${item}`}
                        title={`Xoá ${item}`}
                        onClick={() => setTech((current) => current.filter((tag) => tag !== item))}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600/20"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <TextField
            label="Liên kết"
            name="projectLink"
            value={values.link}
            maxLength={200}
            placeholder="https://…"
            error={errors.link}
            hint="Không bắt buộc — địa chỉ demo hoặc mã nguồn"
            onChange={(event) => setValue('link', event.target.value)}
          />
        </div>

        {status && <Alert tone={status.tone}>{status.message}</Alert>}

        <Button type="submit" loading={saving} icon={FolderPlus}>
          {saving ? 'Đang thêm…' : 'Thêm dự án'}
        </Button>
      </form>
    </Card>
  );
}
