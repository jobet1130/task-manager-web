'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';
import { CreateProjectModal } from '@/components/Modals/CreateProjectModal';
import { useTheme } from '@/context/ThemeContext';
import { useProjectContext } from './ProjectProvider';

export function ProjectsHeader() {
  const { isDark } = useTheme();
  const { projects, addProject, loading, error } = useProjectContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  interface ProjectFormData {
    name: string;
    description: string;
    visibility: 'private' | 'team' | 'public';
    template: 'blank' | 'kanban' | 'scrum' | 'personal';
    color: string;
  }

  const handleCreateProject = async (projectData: ProjectFormData) => {
    try {
      const newProject = {
        name: projectData.name,
        description: projectData.description,
        visibility: projectData.visibility,
        template: projectData.template,
        color: projectData.color,
        status: 'active' as const,
        owner: 'Current User', // This would come from auth context
        members: ['Current User']
      };
      
      await addProject(newProject);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Projects
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and organize your projects efficiently
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={loading}
      />
    </>
  );
}