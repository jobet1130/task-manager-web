'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { useTheme } from '@/context/ThemeContext';
import { useTaskContext } from './TaskProvider';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  const { isDark } = useTheme();
  
  return (
    <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
      <div className="flex items-center">
        <div className={`${bgColor} ${color} p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function TasksStats() {
  const { tasks } = useTaskContext();
  
  const stats = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    completed: tasks.filter(task => task.status === 'done').length,
    overdue: tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'done';
    }).length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Tasks"
        value={stats.total}
        color="text-blue-600"
        bgColor="bg-blue-100"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
      />
      <StatCard
        title="To Do"
        value={stats.todo}
        color="text-gray-600"
        bgColor="bg-gray-100"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        title="In Progress"
        value={stats.inProgress}
        color="text-yellow-600"
        bgColor="bg-yellow-100"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        color="text-green-600"
        bgColor="bg-green-100"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        title="Overdue"
        value={stats.overdue}
        color="text-red-600"
        bgColor="bg-red-100"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
      />
    </div>
  );
}