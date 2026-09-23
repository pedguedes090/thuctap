import React, { useCallback, useEffect, useState } from 'react';
import Alert from '../components/ui/Alert';
import SkillForm from '../components/skills/SkillForm';
import SkillList from '../components/skills/SkillList';
import { deleteSkill, listCategories, listSkills } from '../api/skills';
import { useAuth } from '../hooks/useAuth';

export default function SkillsPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [nextSkills, nextCategories] = await Promise.all([
        listSkills(user.id),
        listCategories(),
      ]);
      setSkills(nextSkills);
      setCategories(nextCategories);
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
      await deleteSkill(id);
      setSkills((current) => current.filter((skill) => skill.id !== id));
    } catch (caught) {
      setError(caught.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <SkillForm categories={categories} onCreated={load} />

      {error && <Alert>{error}</Alert>}

      <SkillList
        skills={skills}
        categories={categories}
        loading={loading}
        onRemove={handleRemove}
        removingId={removingId}
      />
    </div>
  );
}
