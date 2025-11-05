import React, { useState, useEffect } from 'react';
import '../styles/AddTaskForm.css';
import TagSelector from './TagSelector';

const emptyForm = { title: '', description: '', priority: 'medium', tags: [] };

const AddTaskForm = ({ onSubmit, onCancel, editingTask }) => {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (editingTask) {
            const { title, description, priority, tags } = editingTask;
            setForm({ title: title || '', description: description || '', priority: priority || 'medium', tags: tags || [] });
        } else {
            setForm(emptyForm);
        }
    }, [editingTask]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (tags) => setForm(prev => ({ ...prev, tags }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        onSubmit({ ...form });
        if (!editingTask) setForm(emptyForm);
    };

    return (
        <form className="add-task-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <input
                    className="input"
                    type="text"
                    name="title"
                    placeholder="Task title"
                    value={form.title}
                    onChange={handleChange}
                    aria-label="Task title"
                    required
                />
            </div>

            <div className="form-row">
                <textarea
                    className="textarea"
                    name="description"
                    placeholder="Description (optional)"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                />
            </div>

            <div className="form-row dual">
                <select
                    className="select"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    aria-label="Priority"
                >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <TagSelector selectedTags={form.tags} onChange={handleTagsChange} />
            </div>

            <div className="form-actions">
                {onCancel && (
                    <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
                )}
                <button type="submit" className="btn primary">{editingTask ? 'Save Changes' : 'Add Task'}</button>
            </div>
        </form>
    );
};

export default AddTaskForm;