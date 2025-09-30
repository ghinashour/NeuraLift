import React from 'react';
import '../styles/ProgressChart.css';

const ProgressChart = ({ tasks, stats, isModal = false, onClose }) => {
    // Calculate detailed progress data
    const calculateDetailedStats = () => {
        const today = new Date();
        const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // For completed tasks, use completion date; for pending tasks, use created date
        const todayTasks = tasks.filter(task => {
            const taskDate = task.completed && task.completedDate
                ? new Date(task.completedDate)
                : new Date(task.createdDate);
            return taskDate.toDateString() === today.toDateString();
        });

        const weekTasks = tasks.filter(task => {
            const taskDate = task.completed && task.completedDate
                ? new Date(task.completedDate)
                : new Date(task.createdDate);
            return taskDate >= thisWeek;
        });

        const monthTasks = tasks.filter(task => {
            const taskDate = task.completed && task.completedDate
                ? new Date(task.completedDate)
                : new Date(task.createdDate);
            return taskDate >= thisMonth;
        });

        // Category breakdown
        const categoryStats = tasks.reduce((acc, task) => {
            const category = task.category || 'uncategorized';
            if (!acc[category]) {
                acc[category] = { total: 0, completed: 0 };
            }
            acc[category].total++;
            if (task.completed) {
                acc[category].completed++;
            }
            return acc;
        }, {});

        // Priority breakdown
        const priorityStats = tasks.reduce((acc, task) => {
            const priority = task.priority || 'medium';
            if (!acc[priority]) {
                acc[priority] = { total: 0, completed: 0 };
            }
            acc[priority].total++;
            if (task.completed) {
                acc[priority].completed++;
            }
            return acc;
        }, {});

        return {
            today: {
                total: todayTasks.length,
                completed: todayTasks.filter(t => t.completed).length
            },
            week: {
                total: weekTasks.length,
                completed: weekTasks.filter(t => t.completed).length
            },
            month: {
                total: monthTasks.length,
                completed: monthTasks.filter(t => t.completed).length
            },
            categories: categoryStats,
            priorities: priorityStats
        };
    };

    const detailedStats = calculateDetailedStats();
    const overallProgress = stats.totalCount > 0 ? (stats.completedCount / stats.totalCount) * 100 : 0;

    // Circular progress component
    const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#3C83F6" }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className="circular-progress" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="circular-progress-svg">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#E2E4E9"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        className="circular-progress-bar"
                    />
                </svg>
                <div className="circular-progress-text">
                    <span className="progress-percentage">{Math.round(percentage)}%</span>
                    <span className="progress-label">Complete</span>
                </div>
            </div>
        );
    };

    // Progress bar component
    const ProgressBar = ({ label, completed, total, color = "#3C83F6" }) => {
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        return (
            <div className="progress-bar-item">
                <div className="progress-bar-header">
                    <span className="progress-bar-label">{label}</span>
                    <span className="progress-bar-stats">{completed}/{total}</span>
                </div>
                <div className="progress-bar-track">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: color
                        }}
                    />
                </div>
                <span className="progress-bar-percentage">{Math.round(percentage)}%</span>
            </div>
        );
    };

    const content = (
        <div className={`progress-chart ${isModal ? 'progress-chart-modal' : 'progress-chart-page'}`}>
            {isModal && (
                <div className="progress-chart-header">
                    <h2 className="progress-chart-title">Progress Overview</h2>
                    <button className="progress-chart-close" onClick={onClose} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="progress-chart-content">
                {/* Overall Progress */}
                <div className="progress-section">
                    <h3 className="section-title">Overall Progress</h3>
                    <div className="overall-progress">
                        <CircularProgress percentage={overallProgress} />
                        <div className="overall-stats">
                            <div className="stat-item">
                                <span className="stat-number">{stats.totalCount}</span>
                                <span className="stat-label">Total Tasks</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{stats.completedCount}</span>
                                <span className="stat-label">Completed</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{stats.remainingCount}</span>
                                <span className="stat-label">Remaining</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time-based Progress */}
                <div className="progress-section">
                    <h3 className="section-title">Time-based Progress</h3>
                    <div className="time-progress">
                        <ProgressBar
                            label="Today"
                            completed={detailedStats.today.completed}
                            total={detailedStats.today.total}
                            color="#10B981"
                        />
                        <ProgressBar
                            label="This Week"
                            completed={detailedStats.week.completed}
                            total={detailedStats.week.total}
                            color="#3C83F6"
                        />
                        <ProgressBar
                            label="This Month"
                            completed={detailedStats.month.completed}
                            total={detailedStats.month.total}
                            color="#8B5CF6"
                        />
                    </div>
                </div>

                {/* Category Progress */}
                {Object.keys(detailedStats.categories).length > 0 && (
                    <div className="progress-section">
                        <h3 className="section-title">Progress by Category</h3>
                        <div className="category-progress">
                            {Object.entries(detailedStats.categories).map(([category, data], index) => {
                                const colors = ["#3C83F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];
                                return (
                                    <ProgressBar
                                        key={category}
                                        label={category.charAt(0).toUpperCase() + category.slice(1)}
                                        completed={data.completed}
                                        total={data.total}
                                        color={colors[index % colors.length]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Priority Progress */}
                {Object.keys(detailedStats.priorities).length > 0 && (
                    <div className="progress-section">
                        <h3 className="section-title">Progress by Priority</h3>
                        <div className="priority-progress">
                            {Object.entries(detailedStats.priorities).map(([priority, data]) => {
                                const priorityColors = {
                                    high: "#EF4444",
                                    medium: "#F59E0B",
                                    low: "#10B981"
                                };
                                return (
                                    <ProgressBar
                                        key={priority}
                                        label={priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        completed={data.completed}
                                        total={data.total}
                                        color={priorityColors[priority] || "#6B7280"}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Quick Stats Grid */}
                <div className="progress-section">
                    <h3 className="section-title">Quick Statistics</h3>
                    <div className="quick-stats">
                        <div className="quick-stat-card">
                            <div className="quick-stat-icon completed">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="quick-stat-info">
                                <span className="quick-stat-number">{stats.completedCount}</span>
                                <span className="quick-stat-label">Tasks Completed</span>
                            </div>
                        </div>

                        <div className="quick-stat-card">
                            <div className="quick-stat-icon pending">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 18.333A8.333 8.333 0 1 0 1.667 10A8.333 8.333 0 0 0 10 18.333Z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M10 5v5l3.333 1.667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="quick-stat-info">
                                <span className="quick-stat-number">{stats.remainingCount}</span>
                                <span className="quick-stat-label">Tasks Pending</span>
                            </div>
                        </div>

                        <div className="quick-stat-card">
                            <div className="quick-stat-icon rate">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3.333 10h13.334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.333 3.333L20 10l-6.667 6.667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="quick-stat-info">
                                <span className="quick-stat-number">{Math.round(overallProgress)}%</span>
                                <span className="quick-stat-label">Completion Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div className="progress-modal-overlay" onClick={onClose}>
                <div className="progress-modal-content" onClick={e => e.stopPropagation()}>
                    {content}
                </div>
            </div>
        );
    }

    return content;
};

export default ProgressChart;
