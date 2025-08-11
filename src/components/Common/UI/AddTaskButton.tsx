'use client';

import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface AddTaskButtonProps {
  columnId: string;
  onAddTask: (columnId: string, task: Task) => void;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ columnId, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: taskTitle.trim(),
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddTask(columnId, newTask);
    setTaskTitle('');
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTaskTitle('');
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="p-3 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter task title..."
          className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <div className="flex space-x-2 mt-2">
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full p-3 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center space-x-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span>Add a task</span>
    </button>
  );
};