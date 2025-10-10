import React, { useEffect, useState } from "react";
import TaskTable from "../../components/admin/TaskTable";
import AdminTaskAnalytics from "../../components/admin/TaskAnalysis";
import API from "../../api/axios";

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/admin/tasks");
      setTasks(res.data?.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/admin/tasks/analytics/stats");
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const res = await API.put(`/admin/tasks/${id}`, updates);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        🗂️ Task Management
      </h1>

      {/* Analytics */}
      {analytics && (
        <div className="bg-white p-4 rounded-2xl shadow">
          <AdminTaskAnalytics data={analytics} />
        </div>
      )}

      {/* Task Table */}
      <div className="bg-white p-4 rounded-2xl shadow">
        {tasks && tasks.length > 0 ? (
          <TaskTable
            tasks={tasks}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No tasks"
              className="w-20 mb-3 opacity-80"
            />
            <p className="text-lg">No tasks found.</p>
            <p className="text-sm text-gray-400">Tasks will appear here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTasksPage;
