'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';
import { CreateTaskModal } from '@/components/Modals/CreateTaskModal';
import { useTheme } from '@/context/ThemeContext';
import { useTaskContext } from './TaskProvider';

export function TasksHeader() {
  const { isDark } = useTheme();
  const { tasks, addTask } = useTaskContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Add this interface at the top of the file
  interface TaskFormData {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: string;
    assignedTo: string;
    project: string;
    tags: string[];
  }

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      // Convert TaskFormData to Task format
      const newTask = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority, // No type assertion needed now
        status: 'todo' as const,
        assignedTo: taskData.assignedTo,
        dueDate: taskData.dueDate,
        tags: taskData.tags
      };
      
      addTask(newTask);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tasks
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and track your tasks efficiently
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Button>
        </div>
      </div>
      
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}