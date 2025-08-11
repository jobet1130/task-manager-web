'use client';

import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  priorityColor: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  priorityColor
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart();
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  if (isEditing) {
    return (
      <div className={`bg-white rounded-lg border-l-4 ${priorityColor} shadow-sm p-4 space-y-3`}>
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          className="w-full font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task title"
        />
        <textarea
          value={editedTask.description || ''}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          className="w-full text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Task description"
          rows={2}
        />
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-lg border-l-4 ${priorityColor} shadow-sm hover:shadow-md transition-all duration-200 cursor-move group`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 mr-2">
            {task.title}
          </h4>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              title="Edit task"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete task"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(task.priority)}`}>
            {task.priority}
          </span>
          
          {task.dueDate && (
            <span className={`text-xs ${
              isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Assigned User */}
        {task.assignedTo && (
          <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {task.assignedTo.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="ml-2 text-xs text-gray-600">{task.assignedTo}</span>
          </div>
        )}
      </div>
    </div>
  );
};