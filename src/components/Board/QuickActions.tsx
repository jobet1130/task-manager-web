'use client';

import React from 'react';
import { Card } from '@/components/Common/UI/Card';
import { Button } from '@/components/Common/UI/Button';
import { TaskCreateButton } from '@/components/Common/UI/TaskCreateButton';

export function QuickActions() {
  const actions = [
    {
      title: 'New Project',
      description: 'Start a new project',
      icon: '📁',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Invite Team',
      description: 'Add team members',
      icon: '👥',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'View Reports',
      description: 'Check project analytics',
      icon: '📊',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {/* Create Task Button - Now Functional */}
        <div className="w-full">
          <TaskCreateButton 
            onTaskCreated={() => {
              console.log('Task created from QuickActions!');
              // You can add any additional logic here when a task is created
            }}
            notificationType="toast"
          />
        </div>
        
        {/* Other Action Buttons */}
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start p-4 h-auto text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white`}>
                <span className="text-lg">{action.icon}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}