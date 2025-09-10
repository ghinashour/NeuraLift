import React, { useState, useEffect } from 'react';
import TagSelector from './TagSelector';
import { useTaskContext } from '../context/TaskContext';
import { useTags } from '../hooks/useTags';
import '../styles/TaskFormModal.css';

const TaskFormModal = ({ isOpen, onClose, task = null }) => {
    const { addTask, updateTask } = useTaskContext();
    const { suggestions: availableTags } = useTags();
    const isEditing = !!task;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        tags: [],
        dueDate: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                category: task.category || '',
                tags: task.tags || [],
                dueDate: task.dueDate || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                category: '',
                tags: [],
                dueDate: ''
            });
        }
        setErrors({});
    }, [task, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (formData.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const taskData = {
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim(),
            createdDate: task?.createdDate || new Date().toISOString(),
            completed: task?.completed || false
        };

        try {
            if (isEditing) {
                updateTask(task.id, taskData);
            } else {
                addTask(taskData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
            setErrors({ submit: 'Failed to save task. Please try again.' });
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleTagsChange = (selectedTags) => {
        setFormData(prev => ({
            ...prev,
            tags: selectedTags
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="task-modal-overlay" onClick={onClose}>
            <div className="task-modal-content" onClick={e => e.stopPropagation()}>
                <div className="task-modal-header">
                    <h2 className="task-modal-title">
                        {isEditing ? 'Edit Task' : 'Add New Task'}
                    </h2>
                    <button
                        className="task-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="task-modal-form">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter task title..."
                            maxLength={100}
                        />
                        {errors.title && (
                            <span className="error-message">{errors.title}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className={`form-textarea ${errors.description ? 'error' : ''}`}
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Enter task description..."
                            rows={4}
                            maxLength={500}
                        />
                        {errors.description && (
                            <span className="error-message">{errors.description}</span>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="priority" className="form-label">
                                Priority
                            </label>
                            <select
                                id="priority"
                                className="form-select"
                                value={formData.priority}
                                onChange={(e) => handleChange('priority', e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category" className="form-label">
                                Category
                            </label>
                            <input
                                type="text"
                                id="category"
                                className="form-input"
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                placeholder="Enter category..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate" className="form-label">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            className="form-input"
                            value={formData.dueDate}
                            onChange={(e) => handleChange('dueDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tags</label>
                        <TagSelector
                            availableTags={availableTags}
                            selectedTags={formData.tags}
                            onChange={handleTagsChange}
                        />
                    </div>

                    {errors.submit && (
                        <div className="error-message submit-error">
                            {errors.submit}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {isEditing ? 'Update Task' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormModal;
