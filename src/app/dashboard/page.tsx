'use client';

import React from 'react';
import { DashboardLayout } from '@/components/Board/DashboardLayout';
import { DashboardHeader } from '@/components/Board/DashboardHeader';
import { StatsOverview } from '@/components/Board/StatsOverview';
import { RecentTasks } from '@/components/Board/RecentTasks';
import { ProjectsOverview } from '@/components/Board/ProjectOverview';
import { RecentActivity } from '@/components/Board/RecentActivity';
import { QuickActions } from '@/components/Board/QuickActions';
import { UpcomingDeadlines } from '@/components/Board/UpcomingDeadlines';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProjectsOverview />
            <RecentTasks />
            <UpcomingDeadlines />
          </div>
          
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}