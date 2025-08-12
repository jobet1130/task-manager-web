'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useProjectContext } from './ProjectProvider';

export function ProjectsStats() {
  const { isDark } = useTheme();
  const { projects } = useProjectContext();

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on_hold').length,
    avgProgress: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
      : 0
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'blue',
      bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      textColor: 'text-blue-600',
      iconBg: isDark ? 'bg-blue-900/40' : 'bg-blue-100'
    },
    {
      title: 'Active',
      value: stats.active,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'green',
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
      textColor: 'text-green-600',
      iconBg: isDark ? 'bg-green-900/40' : 'bg-green-100'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'purple',
      bgColor: isDark ? 'bg-purple-900/20' : 'bg-purple-50',
      textColor: 'text-purple-600',
      iconBg: isDark ? 'bg-purple-900/40' : 'bg-purple-100'
    },
    {
      title: 'Avg Progress',
      value: `${stats.avgProgress}%`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'orange',
      bgColor: isDark ? 'bg-orange-900/20' : 'bg-orange-50',
      textColor: 'text-orange-600',
      iconBg: isDark ? 'bg-orange-900/40' : 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} ${isDark ? 'border-gray-700' : 'border-gray-200'} border rounded-lg p-6 transition-all duration-200 hover:shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
            </div>
            <div className={`${stat.iconBg} ${stat.textColor} p-3 rounded-lg`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}