import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminAuthContext } from "../../context/AdminAuthContext";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthHeader } = useContext(AdminAuthContext);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/dashboard", {
        headers: getAuthHeader()
      });
      setStats(res.data);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats?.totalUsers || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Mood Entries</h3>
          <p className="stat-number">{stats?.totalMoods || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats?.totalTasks || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Success Stories</h3>
          <p className="stat-number">{stats?.totalStories || 0}</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {/* Add recent activity component here */}
      </div>
    </div>
  );
}

export default Dashboard;