'use client';

import React from 'react';

interface Project {
  id: string;
  name: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  color: string;
  dueDate: string;
}

export const ProjectProgressChart: React.FC = () => {
  // Sample project data - in a real app, this would come from props or API
  const projects: Project[] = [
    {
      id: '1',
      name: 'TaskFlow Web App',
      progress: 75,
      totalTasks: 24,
      completedTasks: 18,
      color: '#3B82F6',
      dueDate: 'Dec 31'
    },
    {
      id: '2',
      name: 'Mobile App',
      progress: 45,
      totalTasks: 16,
      completedTasks: 7,
      color: '#10B981',
      dueDate: 'Jan 15'
    },
    {
      id: '3',
      name: 'API Documentation',
      progress: 90,
      totalTasks: 8,
      completedTasks: 7,
      color: '#F59E0B',
      dueDate: 'Dec 20'
    },
    {
      id: '4',
      name: 'Testing Suite',
      progress: 30,
      totalTasks: 12,
      completedTasks: 4,
      color: '#8B5CF6',
      dueDate: 'Jan 30'
    },
    {
      id: '5',
      name: 'UI/UX Design',
      progress: 85,
      totalTasks: 20,
      completedTasks: 17,
      color: '#EF4444',
      dueDate: 'Dec 25'
    }
  ];

  const getProgressStatus = (progress: number) => {
    if (progress >= 90) return { status: 'Excellent', color: 'text-green-400' };
    if (progress >= 70) return { status: 'Good', color: 'text-blue-400' };
    if (progress >= 50) return { status: 'Fair', color: 'text-yellow-400' };
    return { status: 'Behind', color: 'text-red-400' };
  };

  const averageProgress = Math.round(
    projects.reduce((sum, project) => sum + project.progress, 0) / projects.length
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/80">
          <p className="text-sm">Average Progress</p>
          <p className="text-2xl font-bold text-white">{averageProgress}%</p>
        </div>
        <div className="text-white/80 text-right">
          <p className="text-sm">Active Projects</p>
          <p className="text-2xl font-bold text-white">{projects.length}</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {projects.map((project) => {
          const progressStatus = getProgressStatus(project.progress);
          return (
            <div key={project.id} className="space-y-2">
              {/* Project Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-white font-medium text-sm">
                    {project.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-medium ${progressStatus.color}`}>
                    {progressStatus.status}
                  </span>
                  <span className="text-white/80 text-sm">
                    {project.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${project.progress}%`,
                      backgroundColor: project.color,
                      boxShadow: `0 0 10px ${project.color}40`
                    }}
                  />
                </div>
              </div>

              {/* Task Details */}
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>
                  {project.completedTasks}/{project.totalTasks} tasks completed
                </span>
                <span>Due: {project.dueDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Excellent (90%+)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Good (70-89%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Fair (50-69%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Behind (&lt;50%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};