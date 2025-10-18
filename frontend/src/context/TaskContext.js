import React, { createContext, useContext, useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "../api/taskAPI";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    completedCount: 0,
    remainingCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      const safeData = Array.isArray(data) ? data : [];
      setTasks(safeData);
      calculateStats(safeData);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate task stats
  const calculateStats = (tasksArray) => {
    const safeTasks = Array.isArray(tasksArray) ? tasksArray : [];
    const total = safeTasks.length;
    const completed = safeTasks.filter((t) => t.completed).length;
    const remaining = total - completed;
    setStats({ totalCount: total, completedCount: completed, remainingCount: remaining });
  };

  // Add a new task
  const handleAddTask = async (task) => {
    try {
      const newTask = await addTask(task);
      setTasks((prevTasks) => {
        const safePrevTasks = Array.isArray(prevTasks) ? prevTasks : [];
        const updatedTasks = [...safePrevTasks, newTask];
        calculateStats(updatedTasks);
        return updatedTasks;
      });
      // Also refresh the task list to ensure consistency
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update an existing task
  const handleUpdateTask = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks((prevTasks) => {
        const safePrevTasks = Array.isArray(prevTasks) ? prevTasks : [];
        const updatedTasks = safePrevTasks.map((t) => (t._id === id ? updated : t));
        calculateStats(updatedTasks);
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => {
        const safePrevTasks = Array.isArray(prevTasks) ? prevTasks : [];
        const updatedTasks = safePrevTasks.filter((t) => t._id !== id);
        calculateStats(updatedTasks);
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion
  const toggleTask = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      handleUpdateTask(id, { completed: !task.completed });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        stats,
        addTask: handleAddTask,
        updateTask: handleUpdateTask,
        deleteTask: handleDeleteTask,
        toggleTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
