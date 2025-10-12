import React, { useEffect, useState } from "react";
import TaskTable from "../../components/admin/TaskTable";
import AdminAPI from "../../api/axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await AdminAPI.get("/tasks");
      setTasks(res.data?.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const res = await AdminAPI.get("/tasks/analytics/stats");
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await AdminAPI.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const res = await AdminAPI.put(`/tasks/${id}`, updates);
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

      {/* Analytics Section */}
      {analytics && (
        <div className="bg-white p-4 rounded-2xl shadow space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📊 Task Analytics Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completed Tasks Trend */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-600 mb-2">Completed Tasks Per Day</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics.completedPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Active Users */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-600 mb-2">Top Active Users</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.activeUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Overdue Tasks Summary */}
          <div className="text-center bg-red-50 p-3 rounded-lg border border-red-200">
            <span className="text-red-600 font-semibold">{analytics.overdueTasks}</span> tasks are currently overdue ⚠️
          </div>
        </div>
      )}

      {/* Task Table Section */}
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
