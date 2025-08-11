'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { Button } from '@/components/Common/UI/Button';

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
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{task.project}</p>
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
        <p className="text-sm text-gray-600">{task.dueDate}</p>
        <p className="text-xs text-gray-500 mt-1">{task.assignee}</p>
      </div>
    </div>
  );
}

export function RecentTasks() {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Update user authentication system',
      project: 'TaskFlow Web App',
      priority: 'high',
      status: 'in_progress',
      dueDate: 'Today',
      assignee: 'You'
    },
    {
      id: '2',
      title: 'Design new dashboard layout',
      project: 'TaskFlow Web App',
      priority: 'medium',
      status: 'review',
      dueDate: 'Tomorrow',
      assignee: 'John Doe'
    },
    {
      id: '3',
      title: 'Fix mobile responsive issues',
      project: 'TaskFlow Mobile',
      priority: 'urgent',
      status: 'todo',
      dueDate: 'Dec 15',
      assignee: 'Jane Smith'
    },
    {
      id: '4',
      title: 'Write API documentation',
      project: 'TaskFlow API',
      priority: 'low',
      status: 'done',
      dueDate: 'Dec 10',
      assignee: 'You'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-0">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </Card>
  );
}