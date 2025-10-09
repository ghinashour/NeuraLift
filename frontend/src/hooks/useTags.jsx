import { useMemo, useState } from 'react';

export const useTags = (initial = ['high', 'medium', 'low', 'urgent', 'personal', 'work']) => {
    const [tags, setTags] = useState(initial);
    const addTag = (tag) => {
        const normalized = String(tag || '').trim().toLowerCase();
        if (!normalized) return;
        setTags(prev => (prev.includes(normalized) ? prev : [...prev, normalized]));
    };
    const getTasksByTag = (tasks, tag) => tasks.filter(t => (t.tags || []).includes(tag));
    const suggestions = useMemo(() => tags, [tags]);
    return { tags, addTag, getTasksByTag, suggestions };
};


