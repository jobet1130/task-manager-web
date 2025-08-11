'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useProjectContext } from './ProjectProvider';

export function ProjectsList() {
  const { isDark } = useTheme();
  const { filteredProjects, filters, loading } = useProjectContext();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'team':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'public':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-12 text-center`}>
        <svg className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className={`mt-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
          No projects found
        </h3>
        <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  if (filters.view === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-lg p-6 transition-all duration-200 hover:shadow-lg cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: project.color }}
                ></div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                  {project.name}
                </h3>
              </div>
              <div className="flex items-center space-x-1">
                {getVisibilityIcon(project.visibility)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
              {project.description}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {project.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${project.progress}%`,
                    backgroundColor: project.color
                  }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {project.completedTasks}/{project.tasksCount} tasks
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {project.template}
                </span>
              </div>
              
              {project.dueDate && (
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Due {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDark ? 'bg-gray-750' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Project
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Status
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Progress
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Tasks
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Due Date
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Owner
              </th>
            </tr>
          </thead>
          <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredProjects.map((project) => (
              <tr key={project.id} className={`${isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} cursor-pointer transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <div>
                      <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {project.name}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate max-w-xs`}>
                        {project.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${project.progress}%`,
                          backgroundColor: project.color
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                      {project.progress}%
                    </span>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {project.completedTasks}/{project.tasksCount}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '-'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {project.owner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}