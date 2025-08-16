'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { Button } from '@/components/Common/UI/Button';
import { useTheme } from '@/context/ThemeContext';

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  dueDate: string;
  color: string;
}

function ProjectCard({ project }: { project: Project }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
      isDark ? 'border-transparent bg-transparent' : 'border-transparent bg-transparent'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h4 className={`font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{project.name}</h4>
        </div>
        <span className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>{project.dueDate}</span>
      </div>
      
      <p className={`text-sm mb-3 ${
        isDark ? 'text-gray-300' : 'text-gray-600'
      }`}>{project.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Progress</span>
          <span className={`font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{project.progress}%</span>
        </div>
        <div className={`w-full rounded-full h-2 ${
          isDark ? 'bg-transparent border border-gray-600' : 'bg-transparent border border-gray-300'
        }`}>
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${project.progress}%`,
              backgroundColor: project.color 
            }}
          />
        </div>
        <div className={`flex justify-between text-xs ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <span>{project.completedTasks}/{project.totalTasks} tasks</span>
          <span>{project.totalTasks - project.completedTasks} remaining</span>
        </div>
      </div>
    </div>
  );
}

export function ProjectsOverview() {
  const { isDark } = useTheme();
  const projects: Project[] = [];

  return (
    <Card className={`${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Active Projects</h3>
          {projects.length > 0 && (
            <Button variant="ghost" size="sm">
              View All
            </Button>
          )}
        </div>
        {projects.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No active projects</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}