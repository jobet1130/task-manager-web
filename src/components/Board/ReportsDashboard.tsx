'use client';

import React from 'react';
import { Card } from '../Common/UI/Card';
import { ProjectProgressChart } from './ProjectProgressChart';
import { TeamProductivityChart } from './TeamProductivityChart';
import { ReportsHeader } from '../Reports/ReportsHeader';
import { ReportsMetrics } from '../Reports/ReportsMetrics';
import { TaskStatusDistribution } from '../Reports/TaskStatusDistribution';
import { useReports } from '../Reports/ReportsProvider';

export const ReportsDashboard: React.FC = () => {
  const { reportData } = useReports();

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Header */}
      <ReportsHeader />

      {/* Key Metrics */}
      <ReportsMetrics />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution - Now using the new component */}
        <TaskStatusDistribution />

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Project Progress ({reportData.activeProjects}/{reportData.totalProjects} Active)
          </h3>
          <ProjectProgressChart />
        </Card>

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">
            Team Productivity ({reportData.teamMembers} Members)
          </h3>
          <TeamProductivityChart />
        </Card>
      </div>
    </div>
  );
};