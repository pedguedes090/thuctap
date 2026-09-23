import React, { useCallback, useEffect, useState } from 'react';
import Alert from '../components/ui/Alert';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectList from '../components/projects/ProjectList';
import { deleteProject, listProjects } from '../api/projects';
import { useAuth } from '../hooks/useAuth';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setProjects(await listProjects(user.id));
    } catch (caught) {
      setError(caught.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (id) => {
    setRemovingId(id);
    setError('');

    try {
      await deleteProject(id);
      setProjects((current) => current.filter((project) => project.id !== id));
    } catch (caught) {
      setError(caught.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <ProjectForm onCreated={load} />

      {error && <Alert>{error}</Alert>}

      <ProjectList
        projects={projects}
        loading={loading}
        onRemove={handleRemove}
        removingId={removingId}
      />
    </div>
  );
}
