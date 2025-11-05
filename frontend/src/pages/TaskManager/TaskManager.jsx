import React, { useState } from 'react';
import '../../index.css';
import '../../styles/TaskManager.css';
import ProgressSummary from '../../components/ProgressSummary';
import TaskList from '../../components/TaskList';
import ProgressChart from '../../components/ProgressChart';
import TaskFormModal from '../../components/TaskFormModal';
import AILogo from '../../components/AiLogo';

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
        <>

            <div className="tm-container">
                <div className="tm-header">
                    <div className="tm-title-row">
                        <svg
                            width="40"
                            height="32"
                            viewBox="0 0 40 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="tm-header-icon"
                        >
                            <path
                                d="M16.09 29.3334C23.4538 29.3334 29.4233 23.3639 29.4233 16.0001C29.4233 8.63628 23.4538 2.66675 16.09 2.66675C8.7262 2.66675 2.75666 8.63628 2.75666 16.0001C2.75666 23.3639 8.7262 29.3334 16.09 29.3334Z"
                                stroke="#3C83F6"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M16.09 24C20.5083 24 24.09 20.4183 24.09 16C24.09 11.5817 20.5083 8 16.09 8C11.6717 8 8.09 11.5817 8.09 16C8.09 20.4183 11.6717 24 16.09 24Z"
                                stroke="#3C83F6"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M16.09 18.6666C17.5628 18.6666 18.7567 17.4727 18.7567 15.9999C18.7567 14.5272 17.5628 13.3333 16.09 13.3333C14.6172 13.3333 13.4233 14.5272 13.4233 18.6666Z"
                                stroke="#3C83F6"
                                strokeWidth="2.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h1 className="tm-title">Task Manager</h1>
                    </div>
                    <p style={{ textAlign: "center", color: "#626A84" }}>
                        Organize your goals and track your progress
                    </p>
                </div>

                <div className="tm-top">
                    <ProgressSummary
                        completedCount={stats.completedCount}
                        remainingCount={stats.remainingCount}
                        totalCount={stats.totalCount}
                        onProgressClick={handleProgressClick}
                    />
                </div>

                <button className="tm-add-btn" onClick={handleAddTask}>
                    <span className="tm-add-icon">+</span>
                    Add New Task
                </button>

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
            </div>
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <AILogo />
            </div>
        </>
    );
};

export default TaskManagerPage;