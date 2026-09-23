import React from 'react';
import ProjectCard from './ProjectCard';

function Skeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[0, 1].map((key) => (
        <div key={key} className="rounded-2xl border border-slate-200 bg-white p-6">
          <span className="block h-4 w-40 rounded bg-slate-200" />
          <span className="mt-3 block h-3 w-24 rounded bg-slate-100" />
          <span className="mt-4 block h-3 w-full rounded bg-slate-100" />
          <span className="mt-2 block h-3 w-3/4 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export default function ProjectList({ projects, loading, onRemove, removingId }) {
  if (loading) return <Skeleton />;

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-bold text-slate-900">Chưa có dự án tiêu biểu nào</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Điền tên dự án ở biểu mẫu phía trên rồi bấm “Thêm dự án”. Bạn có thể bổ sung vai trò, mô tả,
          danh sách công nghệ và liên kết sau.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          onRemove={onRemove}
          removing={removingId === project.id}
          delay={Math.min(index * 60, 180)}
        />
      ))}
    </div>
  );
}
