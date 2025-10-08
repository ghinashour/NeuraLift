import { useMemo } from 'react';
import { useLocalStorage } from '../utils/localStorage';
import { calculateProgress } from '../utils/progressCalculators';

export const useTasks = (initialTasks = []) => {
    const [tasks, setTasks] = useLocalStorage('tasks', initialTasks);

    const addTask = (data) => {
        const newTask = {
            id: crypto.randomUUID(),
            title: data.title,
            description: data.description || '',
            priority: data.priority || 'medium',
            category: data.category || '',
            tags: data.tags || [],
            dueDate: data.dueDate || '',
            createdDate: new Date().toISOString(),
            completed: false
        };
        setTasks(prev => [newTask, ...prev]);
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    };

    const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
    const toggleTask = (id) => setTasks(prev => prev.map(t => {
        if (t.id === id) {
            const newCompleted = !t.completed;
            return {
                ...t,
                completed: newCompleted,
                completedDate: newCompleted ? new Date().toISOString() : null
            };
        }
        return t;
    }));

    const filterTasks = (predicate) => tasks.filter(predicate);

    const stats = useMemo(() => calculateProgress(tasks), [tasks]);

    return { tasks, addTask, updateTask, deleteTask, toggleTask, filterTasks, stats };
};


