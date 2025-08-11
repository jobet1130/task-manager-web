'use client';

import React, { useState } from 'react';
import { CreateProjectModal } from '../../Modals/CreateProjectModal';
import { SuccessModal } from '@/components/Modals/SuccessModal';
import { ToastNotification } from '@/components/Modals/ToastNotification';
import { Button } from './Button';

interface ProjectCreateButtonProps {
  onProjectCreated?: () => void;
  notificationType?: 'modal' | 'toast';
}

export const ProjectCreateButton: React.FC<ProjectCreateButtonProps> = ({ 
  onProjectCreated,
  notificationType = 'toast'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createdProjectName, setCreatedProjectName] = useState('');

  const handleCreateProject = async (projectData: { 
    name: string; 
    description: string; 
    visibility: string; 
    template: string; 
    color: string; 
  }) => {
    setLoading(true);
    try {
      // Here you would typically call your API to create the project
      console.log('Creating project:', projectData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the project name for the success message
      setCreatedProjectName(projectData.name);
      
      // Show success notification based on type
      if (notificationType === 'modal') {
        setShowSuccessModal(true);
      } else {
        setShowToast(true);
      }
      
      // Call the callback if provided
      if (onProjectCreated) {
        onProjectCreated();
      }
      
      console.log('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0 shadow-lg flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Project
      </Button>
      
      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={loading}
      />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Project Created Successfully!"
        message={`"${createdProjectName}" has been created and is ready for your team.`}
        autoClose={true}
        autoCloseDelay={4000}
      />
      
      {/* Toast Notification */}
      <ToastNotification
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        message={`Project "${createdProjectName}" created successfully!`}
        type="success"
        duration={4000}
        position="top-right"
      />
    </>
  );
};