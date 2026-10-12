import React, { useState } from 'react';
import '../../index.css';
import '../../styles/TaskManager.css';
import ProgressSummary from '../../components/ProgressSummary';
import TaskList from '../../components/TaskList';
import ProgressChart from '../../components/ProgressChart';
import TaskFormModal from '../../components/TaskFormModal';
import AILogo from '../../components/AiLogo';
import { Plus } from 'lucide-react';

import { useTaskContext } from '../../context/TaskContext';
const TaskManagerPage = () => {
    const { tasks, updateTask, deleteTask, toggleTask, stats } = useTaskContext();
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const handleAddTask = () => {
        setEditingTask(null);
        setShowTaskModal(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskModal(true);
    };

    const handleCloseTaskModal = () => {
        setShowTaskModal(false);
        setEditingTask(null);
    };

    const handleProgressClick = () => {
        setShowProgressModal(true);
    };

    return (
        <div className="nl-page tm-page">
            <div className="nl-hero">
                <div className="nl-hero-copy">
                    <p className="nl-eyebrow">Tasks</p>
                    <h1 className="nl-title">
                        Organize your goals,
                        <br />track your <em>progress</em>.
                    </h1>
                    <p className="nl-lede">
                        A calm space for everything on your plate — add tasks, celebrate
                        completions, and watch your momentum build.
                    </p>
                </div>
                <p className="nl-hero-quote">“What gets planned, gets done.”</p>
            </div>

            <div className="tm-top">
                <ProgressSummary
                    completedCount={stats.completedCount}
                    remainingCount={stats.remainingCount}
                    totalCount={stats.totalCount}
                    onProgressClick={handleProgressClick}
                />
                <button className="btn-primary tm-add-btn" onClick={handleAddTask}>
                    <Plus size={17} />
                    Add New Task
                </button>
            </div>

            <TaskList
                tasks={tasks}
                onTaskToggle={toggleTask}
                onTaskDelete={deleteTask}
                onTaskEdit={handleEditTask}
                onTaskUpdate={updateTask}
            />


            {/* Progress Chart Modal */}
            {showProgressModal && (
                <ProgressChart
                    tasks={tasks}
                    stats={stats}
                    isModal={true}
                    onClose={() => setShowProgressModal(false)}
                />
            )}

            {/* Task Form Modal */}
            <TaskFormModal
                isOpen={showTaskModal}
                onClose={handleCloseTaskModal}
                task={editingTask}
            />
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <AILogo />
            </div>
        </div>
    );
};

export default TaskManagerPage;
