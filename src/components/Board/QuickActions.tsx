'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { TaskCreateButton } from '@/components/Common/UI/TaskCreateButton';
import { ProjectCreateButton } from '../Common/UI/ProjectCreateButton';
import { InviteTeamButton } from '../Common/UI/InviteTeamButton';
import { ViewReportsButton } from '../Common/UI/ViewReport';
import { useTheme } from '@/context/ThemeContext';

export function QuickActions() {
  const { isDark } = useTheme();
  
  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
      <div className="p-6">
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Quick Actions</h3>
        <div className="space-y-3">
          {/* Create Task Button - Functional */}
          <div className="w-full">
            <TaskCreateButton 
              onTaskCreated={() => {
                console.log('Task created from QuickActions!');
              }}
              notificationType="toast"
            />
          </div>
          
          {/* Create Project Button - Functional */}
          <div className="w-full">
            <ProjectCreateButton 
              onProjectCreated={() => {
                console.log('Project created from QuickActions!');
              }}
              notificationType="toast"
            />
          </div>
          
          {/* Invite Team Button - Now Functional with Centered Text */}
          <div className="w-full">
            <InviteTeamButton 
              variant="ghost"
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0 shadow-lg hover:from-purple-600 hover:to-blue-700"
            />
          </div>
          
          {/* View Reports Button - Now Functional */}
          <div className="w-full">
            <ViewReportsButton 
              onReportsViewed={() => {
                console.log('Reports viewed from QuickActions!');
              }}
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}