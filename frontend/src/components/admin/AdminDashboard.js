import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminAuthContext } from "../../context/AdminAuthContext";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { getAuthHeader } = useContext(AdminAuthContext);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      const res = await axios.get("http://localhost:4000/api/admin/dashboard", {
        headers: getAuthHeader()
      });
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button 
          onClick={handleRefresh} 
          className="refresh-btn"
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      
      {/* Core Metrics & KPIs */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <h3>Total Users</h3>
          <p className="stat-number">{stats?.usersCount || 0}</p>
          <div className="stat-trend">
            <span className="trend-up">+{stats?.newUsersThisWeek || 0} this week</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <h3>Active Users</h3>
          <p className="stat-number">{stats?.activeUsers || 0}</p>
          <div className="stat-subtitle">Last 7 days</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <h3>New Users</h3>
          <p className="stat-number">{stats?.newUsersToday || 0}</p>
          <div className="stat-subtitle">Today</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">😊</div>
          <h3>Mood Entries</h3>
          <p className="stat-number">{stats?.moodCounts || 0}</p>
          <div className="stat-trend">
            <span className="trend-up">+{stats?.moodEntriesToday || 0} today</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats?.tasksCount || 0}</p>
          <div className="stat-subtitle">{stats?.completedTasks || 0} completed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🌟</div>
          <h3>Success Stories</h3>
          <p className="stat-number">{stats?.successStoriesCount || 0}</p>
          <div className="stat-subtitle">{stats?.pendingStories || 0} pending</div>
        </div>
      </div>

      {/* User Engagement Analytics */}
      <div className="analytics-section">
        <h2>User Engagement Analytics</h2>
        
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>📊 Engagement Rate</h3>
            <div className="engagement-metric">
              <span className="metric-value">{stats?.engagementRate || 0}%</span>
              <span className="metric-label">Daily Active Users / Total Users</span>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>⏱️ Avg. Session Time</h3>
            <div className="session-metric">
              <span className="metric-value">{stats?.avgSessionTime || 0}m</span>
              <span className="metric-label">Per user session</span>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>🔔 Notifications</h3>
            <div className="notification-metric">
              <span className="metric-value">{stats?.notificationsSent || 0}</span>
              <span className="metric-label">Sent today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mental Health Insights */}
      <div className="mental-health-section">
        <h2>Mental Health Insights</h2>
        
        <div className="insights-grid">
          <div className="insight-card">
            <h3>😊 Mood Distribution</h3>
            <div className="mood-distribution">
              {stats?.moodDistribution?.map(mood => (
                <div key={mood.type} className="mood-item">
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-type">{mood.type}</span>
                  <span className="mood-count">{mood.count}</span>
                  <span className="mood-percentage">{mood.percentage}%</span>
                </div>
              )) || (
                <div className="no-data">No mood data available</div>
              )}
            </div>
          </div>
          
          <div className="insight-card">
            <h3>😰 Stress Levels</h3>
            <div className="stress-levels">
              <div className="stress-metric">
                <span className="stress-value">{stats?.avgStressLevel || 'N/A'}/10</span>
                <span className="stress-trend">
                  {stats?.stressTrend === 'improving' ? '↓ Improving' : 
                   stats?.stressTrend === 'worsening' ? '↑ Worsening' : '→ Stable'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="insight-card">
            <h3>🛠️ Top Activities</h3>
            <div className="activities-list">
              {stats?.topActivities?.map((activity, index) => (
                <div key={activity.name} className="activity-item">
                  <span className="activity-rank">#{index + 1}</span>
                  <span className="activity-name">{activity.name}</span>
                  <span className="activity-usage">{activity.usageCount} uses</span>
                </div>
              )) || (
                <div className="no-data">No activity data available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content & System Overview */}
      <div className="content-section">
        <h2>Content & System Overview</h2>
        
        <div className="content-grid">
          <div className="content-card">
            <h3>📝 User Content</h3>
            <div className="content-stats">
              <div className="content-metric">
                <span className="metric-value">{stats?.journalEntries || 0}</span>
                <span className="metric-label">Journal Entries</span>
              </div>
              <div className="content-metric">
                <span className="metric-value">{stats?.meditationSessions || 0}</span>
                <span className="metric-label">Meditation Sessions</span>
              </div>
            </div>
          </div>
          
          <div className="content-card">
            <h3>🎯 Challenges</h3>
            <div className="challenge-stats">
              <div className="challenge-metric">
                <span className="metric-value">{stats?.activeChallenges || 0}</span>
                <span className="metric-label">Active</span>
              </div>
              <div className="challenge-metric">
                <span className="metric-value">{stats?.challengeCompletions || 0}</span>
                <span className="metric-label">Completions</span>
              </div>
            </div>
          </div>
          
          <div className="content-card">
            <h3>🔧 System Status</h3>
            <div className="system-status">
              <div className="status-item">
                <span className="status-indicator online"></span>
                <span>API Server</span>
              </div>
              <div className="status-item">
                <span className="status-indicator online"></span>
                <span>Database</span>
              </div>
              <div className="status-item">
                <span className="status-indicator online"></span>
                <span>Authentication</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="recent-activity">
        <h2>Recent Activity Feed</h2>
        <div className="activity-feed">
          {stats?.recentActivities?.map(activity => (
            <div key={activity.id} className="activity-item">
              <span className="activity-time">{activity.time}</span>
              <span className="activity-message">{activity.message}</span>
            </div>
          )) || (
            <div className="no-data">No recent activities</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn">📧 Send Broadcast</button>
          <button className="action-btn">👥 Manage Users</button>
          <button className="action-btn">📊 View Reports</button>
          <button className="action-btn">⚙️ System Settings</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;