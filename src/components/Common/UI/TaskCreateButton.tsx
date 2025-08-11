'use client';

import React, { useState } from 'react';
import { CreateTaskModal } from '../../Modals/CreateTaskModal';
import { SuccessModal } from '@/components/Modals/SuccessModal';
import { ToastNotification } from '@/components/Modals/ToastNotification';
import { Button } from './Button';

interface TaskCreateButtonProps {
  onTaskCreated?: () => void;
  notificationType?: 'modal' | 'toast';
}

export const TaskCreateButton: React.FC<TaskCreateButtonProps> = ({ 
  onTaskCreated,
  notificationType = 'toast'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createdTaskTitle, setCreatedTaskTitle] = useState('');

  const handleCreateTask = async (taskData: { title: string; description?: string; dueDate?: Date }) => {
    setLoading(true);
    try {
      // Here you would typically call your API to create the task
      console.log('Creating task:', taskData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the task title for the success message
      setCreatedTaskTitle(taskData.title);
      
      // Show success notification based on type
      if (notificationType === 'modal') {
        setShowSuccessModal(true);
      } else {
        setShowToast(true);
      }
      
      // Call the callback if provided
      if (onTaskCreated) {
        onTaskCreated();
      }
      
      console.log('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Task
      </Button>
      
      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(taskData) => handleCreateTask({
          ...taskData,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined
        })}
        loading={loading}
      />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Task Created Successfully!"
        message={`"${createdTaskTitle}" has been created and added to your project.`}
        autoClose={true}
        autoCloseDelay={4000}
      />
      
      {/* Toast Notification */}
      <ToastNotification
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        message={`Task "${createdTaskTitle}" created successfully!`}
        type="success"
        duration={4000}
        position="top-right"
      />
    </>
  );
};