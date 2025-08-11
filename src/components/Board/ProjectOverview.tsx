'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { Button } from '@/components/Common/UI/Button';

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
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h4 className="font-medium text-gray-900">{project.name}</h4>
        </div>
        <span className="text-sm text-gray-500">{project.dueDate}</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${project.progress}%`,
              backgroundColor: project.color 
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{project.completedTasks}/{project.totalTasks} tasks</span>
          <span>{project.totalTasks - project.completedTasks} remaining</span>
        </div>
      </div>
    </div>
  );
}

export function ProjectsOverview() {
  const projects: Project[] = [
    {
      id: '1',
      name: 'TaskFlow Web App',
      description: 'Main web application development',
      progress: 75,
      totalTasks: 24,
      completedTasks: 18,
      dueDate: 'Dec 31',
      color: '#3B82F6'
    },
    {
      id: '2',
      name: 'Mobile App',
      description: 'React Native mobile application',
      progress: 45,
      totalTasks: 16,
      completedTasks: 7,
      dueDate: 'Jan 15',
      color: '#10B981'
    },
    {
      id: '3',
      name: 'API Documentation',
      description: 'Complete API documentation and guides',
      progress: 90,
      totalTasks: 8,
      completedTasks: 7,
      dueDate: 'Dec 20',
      color: '#F59E0B'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Card>
  );
}