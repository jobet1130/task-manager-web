'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { useReports } from './ReportsProvider';

export const ReportsMetrics: React.FC = () => {
  const { reportData, isLoading } = useReports();

  const getCompletionRate = () => {
    if (reportData.totalTasks === 0) return 0;
    return Math.round((reportData.completedTasks / reportData.totalTasks) * 100);
  };

  const getProjectCompletionRate = () => {
    if (reportData.totalProjects === 0) return 0;
    return Math.round((reportData.activeProjects / reportData.totalProjects) * 100);
  };

  const metrics = [
    {
      title: 'Total Tasks',
      value: reportData.totalTasks,
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bgColor: 'bg-blue-500/20',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Completed Tasks',
      value: reportData.completedTasks,
      icon: (
        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-green-500/20',
      subtitle: `${getCompletionRate()}% completion rate`,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Active Projects',
      value: reportData.activeProjects,
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: 'bg-purple-500/20',
      subtitle: `${getProjectCompletionRate()}% active`,
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Overdue Tasks',
      value: reportData.overdueTasks,
      icon: (
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-red-500/20',
      change: '-5%',
      changeType: 'negative'
    },
    {
      title: 'Team Members',
      value: reportData.teamMembers,
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'bg-yellow-500/20',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Avg Completion Time',
      value: `${reportData.avgCompletionTime}d`,
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-indigo-500/20',
      change: '-0.5d',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white/80 text-sm mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-white mb-1">
                {isLoading ? (
                  <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                ) : (
                  metric.value
                )}
              </p>
              {metric.subtitle && (
                <p className="text-white/60 text-xs">{metric.subtitle}</p>
              )}
              {metric.change && (
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.changeType === 'positive' ? '↗' : '↘'} {metric.change}
                  </span>
                  <span className="text-white/60 text-xs ml-1">vs last period</span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
              {metric.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};