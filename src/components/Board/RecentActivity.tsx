'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { useTheme } from '@/context/ThemeContext';

interface Activity {
  id: string;
  type: 'task_created' | 'task_completed' | 'project_updated' | 'comment_added';
  message: string;
  user: string;
  timestamp: string;
  icon: string;
}

function ActivityItem({ activity }: { activity: Activity }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
    }`}>
      <div className="flex-shrink-0">
        <span className="text-lg">{activity.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{activity.message}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>{activity.user}</span>
          <span className={`text-xs ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>•</span>
          <span className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export function RecentActivity() {
  const { isDark } = useTheme();
  const activities: Activity[] = []; // Empty activities array

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
      <div className="p-6">
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Recent Activity</h3>
        {activities.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}