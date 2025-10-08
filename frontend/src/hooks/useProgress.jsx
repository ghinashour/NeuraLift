import { useMemo } from 'react';

export const useProgress = (tasks) => {
    return useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const remaining = total - completed;
        const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        const getProgressByCategory = (category) => {
            const inCat = tasks.filter(t => (t.tags || []).includes(category));
            const comp = inCat.filter(t => t.completed).length;
            const tot = inCat.length || 1;
            return Math.round((comp / tot) * 100);
        };
        return { completedCount: completed, remainingCount: remaining, completionPercentage, getProgressByCategory };
    }, [tasks]);
};


