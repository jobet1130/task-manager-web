'use client';

import React from 'react';
import { DashboardLayout } from '@/components/Board/DashboardLayout';
import { TasksHeader } from '@/components/Task/TasksHeader';
import { TasksFilters } from '@/components/Task/TasksFilters';
import { TasksList } from '@/components/Task/TasksList';
import { TasksStats } from '@/components/Task/TasksStats';
import { TaskProvider } from '@/components/Task/TaskProvider';

export default function TasksPage() {
  return (
    <DashboardLayout>
      <TaskProvider>
        <div className="space-y-6">
          <TasksHeader />
          <TasksStats />
          <TasksFilters />
          <TasksList />
        </div>
      </TaskProvider>
    </DashboardLayout>
  );
}