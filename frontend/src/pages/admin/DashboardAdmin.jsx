import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Card from "../../components/admin/CardAdmin";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Total Stories" value={stats.totalStories} />
        <Card title="Total Notes" value={stats.totalNotes} />
        <Card title="Total Tasks" value={stats.totalTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
