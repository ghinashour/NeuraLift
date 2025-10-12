import React, { useState } from 'react';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';

const TaskList = ({ tasks = [], onTaskUpdate, onTaskDelete, onTaskToggle, onTaskEdit }) => {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    // Ensure tasks is always an array
    const safeTasks = tasks || [];

    const filteredTasks = safeTasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.createdDate) - new Date(a.createdDate);
        }
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        if (sortBy === 'status') {
            return a.completed - b.completed;
        }
        return 0;
    });

    if (safeTasks.length === 0) {
        return (
            <div className="task-list">
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No tasks yet</h3>
                    <p>Create your first task to get started with your productivity journey!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="task-list">
            <div className="task-list-header">
                <div className="task-filters">
                    <button
                        className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setFilter('all')}
                    >
                        All ({safeTasks.length})
                    </button>
                    <button
                        className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({safeTasks.filter(t => !t.completed).length})
                    </button>
                    <button
                        className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({safeTasks.filter(t => t.completed).length})
                    </button>
                </div>

                <div className="task-sort">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="title">Sort by Title</option>
                        <option value="status">Sort by Status</option>
                    </select>
                </div>
            </div>

            <div className="task-items">
                {sortedTasks.map(task => (
                    <TaskItem
                        key={task.id || task._id}
                        task={task}
                        onToggleComplete={onTaskToggle}
                        onEdit={onTaskEdit}
                        onDelete={onTaskDelete}
                    />
                ))}
            </div>

            {sortedTasks.length === 0 && safeTasks.length > 0 && (
                <div className="no-results">
                    <p>No tasks match the current filter.</p>
                </div>
            )}
        </div>
    );
};

export default TaskList;
