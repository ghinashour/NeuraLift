export const calculateProgress = (tasks) => {
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const remainingCount = totalCount - completedCount;
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { completedCount, remainingCount, totalCount, completionPercentage };
};


