/**
 * Reusable card-button (270x166) with gradient icon chip.
 * Replace <a> with <Link> if you use React Router.
 */
import React from "react";
import { FaClock, FaTasks, FaBrain, FaHeart } from "react-icons/fa";
import "../styles/Dashboard.css";

const iconMap = {
  timer: <FaClock className="action-icon-svg" />,
  tasks: <FaTasks className="action-icon-svg" />,
  brain: <FaBrain className="action-icon-svg" />,
  heart: <FaHeart className="action-icon-svg" />,
};

export default function ActionButton({ title, subtitle, gradient, icon, href }) {
  return (
    <a className="action-card" href={href}>
      <div className="action-icon" style={{ background: gradient }} aria-hidden>
        <div className="action-icon-inner">
          {iconMap[icon] || <FaHeart className="action-icon-svg" />}
        </div>
      </div>
      <div className="action-card-content">
        <div className="action-title">{title}</div>
        <div className="action-subtext">{subtitle}</div>
      </div>
    </a>
  );
}