import React from 'react';
import { FaFire, FaBell, FaChartLine } from 'react-icons/fa';
import './../styles/Dashboard.css';

export default function DashboardStats({ streak = 0, unread = 0 }) {
  const productivityPercent = Math.min(100, Math.round((streak / 30) * 100));

  return (
    <section className="stats-grid" aria-label="User statistics">
      <div className="stat-card">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="stat-icon" style={{background: 'linear-gradient(90deg,#ff9a3c,#ff6a00)'}}>
            <FaFire color="#fff" />
          </div>
          <div>
            <div className="stat-title">Streak</div>
            <div className="stat-value">{streak} 🔥</div>
            <div className="stat-sub">Keep the momentum going — daily check-ins</div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="stat-icon" style={{background: 'linear-gradient(90deg,#3C83F6,#6DA2F8)'}}>
            <FaBell color="#fff" />
          </div>
          <div>
            <div className="stat-title">Notifications</div>
            <div className="stat-value">{unread} unread</div>
            <div className="stat-sub">Real-time updates, messages & task alerts</div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="stat-icon" style={{background: 'linear-gradient(90deg,#16A249,#1CCE5E)'}}>
            <FaChartLine color="#fff" />
          </div>
          <div>
            <div className="stat-title">Weekly progress</div>
            <div className="stat-value">{productivityPercent}%</div>
            <div className="stat-sub">Estimated progress toward 30-day goal</div>
          </div>
        </div>
      </div>
    </section>
  );
}
