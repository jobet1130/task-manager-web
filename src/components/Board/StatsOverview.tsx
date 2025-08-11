'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { useTheme } from '@/context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

function StatCard({ title, value, icon, change, changeType = 'neutral' }: StatCardProps) {
  const { isDark } = useTheme();
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: isDark ? 'text-gray-400' : 'text-gray-600'
  }[changeType];

  return (
    <Card className={`p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-1`}>{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColor}`}>{change}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}

export function StatsOverview() {
  const stats = [
    {
      title: 'Total Tasks',
      value: 24,
      icon: '📋',
      change: '+3 from yesterday',
      changeType: 'positive' as const
    },
    {
      title: 'Completed',
      value: 18,
      icon: '✅',
      change: '+5 from yesterday',
      changeType: 'positive' as const
    },
    {
      title: 'In Progress',
      value: 4,
      icon: '⏳',
      change: '-2 from yesterday',
      changeType: 'negative' as const
    },
    {
      title: 'Overdue',
      value: 2,
      icon: '⚠️',
      change: 'Same as yesterday',
      changeType: 'neutral' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}