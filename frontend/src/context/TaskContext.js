import React, { createContext, useContext } from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
    const tasksApi = useTasks();
    return <TaskContext.Provider value={tasksApi}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
    return ctx;
};


