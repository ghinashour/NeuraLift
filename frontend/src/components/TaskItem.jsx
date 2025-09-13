import React, { useState } from 'react';
import { CheckCircle, Circle, Edit3, Trash2, Calendar } from 'lucide-react';
import '../styles/TaskItem.css';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getTagColor = (tag) => {
        const colors = {
            high: '#EF4343',
            medium: '#16A249',
            low: '#3C83F6',
            urgent: '#7C3BED',
            personal: '#F59E0B',
            work: '#10B981'
        };
        return colors[tag] || '#626A84';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleToggleComplete = () => {
        onToggleComplete(task.id);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(task);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(task.id);
    };

    return (
        <div
            className={`task-item ${task.completed ? 'completed' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="task-checkbox" onClick={handleToggleComplete}>
                <div className={`checkbox ${task.completed ? 'checked' : ''}`}>
                    {task.completed ? (
                        <CheckCircle size={20} className="check-icon" />
                    ) : (
                        <Circle size={20} className="circle-icon" />
                    )}
                </div>
            </div>

            <div className="task-content">
                <div className="task-header">
                    <div className="task-title-row">
                        <h3 className={`task-title ${task.completed ? 'completed-title' : ''}`}>
                            {task.title}
                        </h3>
                        {task.tags && task.tags.length > 0 && (
                            <div className="task-tags">
                                {task.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="task-tag"
                                        style={{ backgroundColor: getTagColor(tag) }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={`task-actions ${isHovered ? 'visible' : ''}`}>
                        <button
                            onClick={handleEdit}
                            className="action-btn edit-btn"
                            title="Edit task"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="action-btn delete-btn"
                            title="Delete task"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {task.description && (
                    <p className={`task-description ${task.completed ? 'completed-text' : ''}`}>
                        {task.description}
                    </p>
                )}

                <div className="task-meta">
                    <div className="task-date">
                        <Calendar size={12} />
                        <span>Created {formatDate(task.createdDate)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;