'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';
import { NotificationModal } from '@/components/Modals/NotificationModal';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  // Move notifications state to TopNavbar
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Task Assigned',
      message: 'You have been assigned to "Implement user authentication"',
      type: 'info',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false
    },
    {
      id: '2',
      title: 'Project Updated',
      message: 'TaskFlow Dashboard project has been updated by John Doe',
      type: 'success',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false
    },
    {
      id: '3',
      title: 'Deadline Approaching',
      message: 'Task "Design system components" is due in 2 hours',
      type: 'warning',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true
    },
    {
      id: '4',
      title: 'Team Invitation',
      message: 'Sarah Wilson invited you to join "Mobile App Development" project',
      type: 'info',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true
    }
  ]);
  
  // Calculate unread count from actual notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            ☰
          </Button>
          
          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks, projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button 
              onClick={() => setIsNotificationModalOpen(true)}
              className="relative text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Settings */}
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </>
  );
}