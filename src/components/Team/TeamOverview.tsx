'use client';

import React from 'react';
import { Card } from '../Common/UI/Card';
import { useTheme } from '@/context/ThemeContext';
import { TeamStats } from './types';

interface TeamOverviewProps {
  stats: TeamStats;
}

export const TeamOverview: React.FC<TeamOverviewProps> = ({ stats }) => {
  const { isDark } = useTheme();

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Active Members',
      value: stats.activeMembers,
      icon: '🟢',
      color: 'green'
    },
    {
      title: 'Tasks Completed',
      value: stats.totalTasksCompleted,
      icon: '✅',
      color: 'purple'
    },
    {
      title: 'Avg Efficiency',
      value: `${stats.averageEfficiency}%`,
      icon: '📊',
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
            </div>
            <div className="text-3xl">
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};