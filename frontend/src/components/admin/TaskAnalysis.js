import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const AdminTaskAnalytics = ({ data }) => {
  const { completedPerDay = [], overdueTasks = 0, activeUsers = [] } = data;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Task Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed tasks trend */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-600 mb-2">Completed Tasks Per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={completedPerDay}>
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
            <BarChart data={activeUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overdue summary */}
      <div className="text-center bg-red-50 p-3 rounded-lg border border-red-200">
        <span className="text-red-600 font-semibold">{overdueTasks}</span> tasks are currently overdue ⚠️
      </div>
    </div>
  );
};

export default AdminTaskAnalytics;
