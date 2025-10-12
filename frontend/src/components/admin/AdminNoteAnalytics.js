import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../styles/AdminNotes.css";

function AdminNoteAnalytics() {
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await AdminAPI.get("/notes/analytics/trend");
        setTrend(res.data.trend);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrend();
  }, []);

  return (
    <div className="admin-note-analytics">
      <h2>📈 Notes Analytics</h2>
      <p className="subtitle">Notes created per day</p>

      {trend.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4a90e2" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default AdminNoteAnalytics;
