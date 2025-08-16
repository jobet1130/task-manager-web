'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { useTheme } from '@/context/ThemeContext';

interface DeadlineItem {
  id: string;
  title: string;
  type: 'task' | 'project';
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'review';
  assignedTo?: string;
}

interface UpcomingDeadlinesProps {
  items?: DeadlineItem[];
  maxHeight?: string;
}

export function UpcomingDeadlines({ items = [], maxHeight = '400px' }: UpcomingDeadlinesProps) {
  const { isDark } = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <Card className={`${isDark ? 'bg-gray-800' : 'bg-white'} flex flex-col`}>
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Upcoming Deadlines
        </h3>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {items.length} items
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="overflow-y-auto px-6 pb-6" 
        style={{ maxHeight }}
      >
        <div className="space-y-3 pt-2">
          {items.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-4xl mb-2">📅</div>
              <p>No upcoming deadlines</p>
            </div>
          ) : (
            items.map((item) => {
              const daysUntil = getDaysUntilDue(item.dueDate);
              const isOverdue = daysUntil < 0;
              const isDueToday = daysUntil === 0;
              
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-colors hover:shadow-md ${
                    isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                  } ${
                    isOverdue ? 'bg-red-50 border-red-200' : isDueToday ? 'bg-yellow-50 border-yellow-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.title}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.type === 'project' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)} ${getPriorityBg(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        {item.assignedTo && (
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            👤 {item.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        isOverdue ? 'text-red-600' : isDueToday ? 'text-yellow-600' : isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {formatDueDate(item.dueDate)}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer - Fixed */}
      {items.length > 0 && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button className={`text-sm font-medium hover:underline ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}>
            View all deadlines →
          </button>
        </div>
      )}
    </Card>
  );
}