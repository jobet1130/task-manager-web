'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';

interface Activity {
  id: string;
  type: 'task_created' | 'task_completed' | 'project_updated' | 'comment_added';
  message: string;
  user: string;
  timestamp: string;
  icon: string;
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <span className="text-lg">{activity.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-gray-500">{activity.user}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export function RecentActivity() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'task_completed',
      message: 'Completed "Update user authentication system"',
      user: 'You',
      timestamp: '2 hours ago',
      icon: '✅'
    },
    {
      id: '2',
      type: 'comment_added',
      message: 'Added comment to "Design new dashboard layout"',
      user: 'John Doe',
      timestamp: '4 hours ago',
      icon: '💬'
    },
    {
      id: '3',
      type: 'task_created',
      message: 'Created new task "Fix mobile responsive issues"',
      user: 'Jane Smith',
      timestamp: '6 hours ago',
      icon: '➕'
    },
    {
      id: '4',
      type: 'project_updated',
      message: 'Updated project "TaskFlow Web App" settings',
      user: 'You',
      timestamp: '1 day ago',
      icon: '📝'
    },
    {
      id: '5',
      type: 'task_completed',
      message: 'Completed "Write API documentation"',
      user: 'Mike Johnson',
      timestamp: '2 days ago',
      icon: '✅'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-1">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </Card>
  );
}