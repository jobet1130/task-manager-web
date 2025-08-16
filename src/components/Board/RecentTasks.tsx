'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { useTheme } from '@/context/ThemeContext';

interface Task {
  id: string;
  title: string;
  project: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate: string;
  assignee: string;
}

function TaskItem({ task }: { task: Task }) {
  const { isDark } = useTheme();
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    review: 'bg-purple-100 text-purple-800',
    done: 'bg-green-100 text-green-800'
  };

  return (
    <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'} last:border-b-0`}>
      <div className="flex-1">
        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{task.title}</h4>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{task.project}</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.dueDate}</p>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{task.assignee}</p>
      </div>
    </div>
  );
}

export function RecentTasks() {
  const { isDark } = useTheme();
  const tasks: Task[] = []; // Empty tasks array

  return (
    <Card className={`${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Tasks</h2>
        {tasks.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No recent tasks</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}