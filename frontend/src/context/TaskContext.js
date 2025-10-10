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

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const remaining = total - completed;
    setStats({ totalCount: total, completedCount: completed, remainingCount: remaining });
  };

  const handleAddTask = async (task) => {
    try {
      const newTask = await addTask(task);
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      calculateStats(updatedTasks);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      const updatedTasks = tasks.map((t) => (t._id === id ? updated : t));
      setTasks(updatedTasks);
      calculateStats(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      const updatedTasks = tasks.filter((t) => t._id !== id);
      setTasks(updatedTasks);
      calculateStats(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTask = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      handleUpdateTask(id, { status: newStatus });
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
