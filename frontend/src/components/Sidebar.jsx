import React,{useEffect}from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import avatarPlaceholder from "../assets/avatar.png";
import useUserData from '../hooks/useUserData';
const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/api\/?$/, "").replace(/\/$/, "");
// Same mark as landing page Navbar (nl-mark) — single source of truth for brand
const LandingMark = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 2C10 7 6 9 6 15a8 8 0 0 0 16 0c0-6-4-8-8-13Z" fill="#8E7FB8"/>
    <path d="M14 6v16M14 12l-5-3M14 12l5-3M14 17l-4-2M14 17l4-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { key: 'timer', label: 'Focus Timer', path: '/focusTimer' },
  { key: 'tasks', label: 'Tasks', path: '/taskManager' },
  { key: 'mood', label: 'Mood Tracker', path: '/moodTracker' },
  { key: 'stress', label: 'Stress Relief', path: '/stressRelief' },
  { key: 'success', label: 'Success Stories', path: '/success-stories' },
  { key: 'challenges', label: 'Challenges', path: '/Challenges' },
  { key: 'collab', label: 'Collaborate', path: '/collaborate' },
  { key: 'schedule', label: 'Schedule', path: '/Schedule' },
  { key: 'medicine', label: 'Medicine & Health', path: '/medicineHealth' },
  { key: 'assistant', label: 'AI Assistant', path: '/ai-assistant' }
];

const Sidebar = ({ isSidebarOpen, toggleSidebar, loading = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, fetchUserData } = useUserData();

  useEffect(() => {
  const handleUserUpdate = () => fetchUserData(); // refresh user data
  window.addEventListener("userUpdated", handleUserUpdate);

  return () => window.removeEventListener("userUpdated", handleUserUpdate);
}, [fetchUserData]);


  const handleNavClick = (path) => {
    // Navigation for all items
    navigate(path);
  };

  const isActive = (path) => {
  if (path === '/') return location.pathname === '/';
  return location.pathname.toLowerCase().startsWith(path.toLowerCase());
};

  return (
    <>
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon brand-icon--landing">
            <LandingMark size={40} />
          </div>
          {(
            <>
              <div className="sidebar-brand-name">Neuralift</div>
              <div className="brand-sub">Your wellness companion</div>
            </>
          )}
        </div>

        <nav className="nav nav--text-only">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
              title={item.label} // tooltip when collapsed
            >
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link to="/profile" className="profile-section profile-link" title={(user?.username || user?.name || "User")}> {/* Wrap entire section with Link */}
            <div className="profile">
              {loading ? (
                <div className="profile-loading">
                  <div className="loading-avatar"></div>
                  <div className="loading-username"></div>
                </div>
              ) : (
                <>
                  <img
                    src={
                      user?.profilePhoto
                        ? `${API_ORIGIN}/uploads/${user.profilePhoto}`
                        : avatarPlaceholder
                    }
                    alt={user?.username || user?.name || "User"}
                    className="sidebar-avatar"
                    onError={(e) => {
                      // fallback to placeholder if image fails to load
                      e.target.src = avatarPlaceholder;
                    }}
                  />
                  {(
                    <span className="sidebar-username">{user?.username || user?.name || "User"}</span>
                  )}
                </>
              )}
            </div>

          </Link> {/* Close the Link tag for the section */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;