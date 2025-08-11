'use client';

import React from 'react';
import { TaskCard } from '../Common/UI/TaskCard';

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

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface KanbanColumnProps {
  column: Column;
  onDrop: (columnId: string) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onDragStart: (task: Task, columnId: string) => void;
  onDragEnd: () => void;
  isDragOver: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onDrop,
  onTaskUpdate,
  onTaskDelete,
  onDragStart,
  onDragEnd,
  isDragOver
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(column.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div 
      className={`flex-shrink-0 w-80 ${column.color} rounded-lg border-2 transition-all duration-200 ${
        isDragOver ? 'border-blue-400 bg-blue-50' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="p-4 space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
        {column.tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs">Drag tasks here or create new ones</p>
          </div>
        ) : (
          column.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              onDragStart={() => onDragStart(task, column.id)}
              onDragEnd={onDragEnd}
              priorityColor={getPriorityColor(task.priority)}
            />
          ))
        )}
      </div>
    </div>
  );
};