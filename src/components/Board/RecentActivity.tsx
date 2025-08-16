'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { useTheme } from '@/context/ThemeContext';

interface Activity {
  id: string;
  type: 'task_created' | 'task_completed' | 'project_updated' | 'comment_added';
  description: string;
  timestamp: string;
  user: string;
}

function ActivityItem({ activity }: { activity: Activity }) {
  const { isDark } = useTheme();
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_created': return '✅';
      case 'task_completed': return '🎉';
      case 'project_updated': return '📁';
      case 'comment_added': return '💬';
      default: return '📝';
    }
  };

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
      isDark ? 'hover:bg-transparent' : 'hover:bg-transparent'
    }`}>
      <div className="flex-shrink-0">
        <span className="text-lg">{getActivityIcon(activity.type)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {activity.description}
        </p>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
          {activity.user} • {activity.timestamp}
        </p>
      </div>
    </div>
  );
}

export function RecentActivity() {
  const { isDark } = useTheme();
  const activities: Activity[] = []; // Empty activities array

  return (
    <Card className={`${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
        {activities.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}