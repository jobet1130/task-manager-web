'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';
import { BackToDashboardButton } from '@/components/Common/UI/BackToDashboardButton';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const NotificationsPage: React.FC = () => {
  // Sample notifications data - replace with actual data fetching
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Task Completed',
      message: 'Your task "Design Homepage" has been completed successfully.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
    },
    {
      id: '2',
      title: 'New Comment',
      message: 'John Doe commented on your task "Fix Login Bug".',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
    {
      id: '3',
      title: 'Deadline Approaching',
      message: 'Task "Update Documentation" is due in 2 hours.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
    },
    {
      id: '4',
      title: 'Task Overdue',
      message: 'Task "Review Code" is now overdue.',
      type: 'error',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-400/30 bg-green-500/10';
      case 'warning': return 'border-yellow-400/30 bg-yellow-500/10';
      case 'error': return 'border-red-400/30 bg-red-500/10';
      default: return 'border-blue-400/30 bg-blue-500/10';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackToDashboardButton variant="compact" />
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-blue-200">{unreadCount} unread notifications</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
              <p className="text-white/60">When you have notifications, they&apos;ll appear here.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:bg-white/5 ${
                  notification.read ? 'bg-white/5 border-white/10' : `${getTypeColor(notification.type)} border-opacity-50`
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${
                          notification.read ? 'text-white/80' : 'text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`text-base mt-2 ${
                          notification.read ? 'text-white/60' : 'text-white/80'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-white/50 mt-3">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-white/60 hover:text-white hover:bg-white/10"
                            title="Mark as read"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-red-400 hover:bg-red-500/10"
                          title="Delete notification"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    
    {/* Optional: Floating back button */}
    {/* <BackToDashboardButton variant="floating" /> */}
    </div>
  );
};

export default NotificationsPage;