'use client';

import React, { useState } from 'react';
import { Card } from '../Common/UI/Card';
import { Button } from '../Common/UI/Button';
import { TasksChart } from './TaskChart';
import { ProjectProgressChart } from './ProjectProgressChart'
import { TeamProductivityChart } from './TeamProductivityChart';
import { ReportFiltersModal } from '../Common/UI/ReportFiltersModal';
import { ExportReportModal } from '@/components/Modals/ExportReportModal'
interface ReportData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalProjects: number;
  activeProjects: number;
  teamMembers: number;
  avgCompletionTime: number;
}

export const ReportsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [reportData] = useState<ReportData>({
    totalTasks: 156,
    completedTasks: 89,
    inProgressTasks: 45,
    overdueTasks: 12,
    totalProjects: 8,
    activeProjects: 5,
    teamMembers: 12,
    avgCompletionTime: 3.2
  });

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const getCompletionRate = () => {
    return Math.round((reportData.completedTasks / reportData.totalTasks) * 100);
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value} className="bg-gray-800 text-white">
                {period.label}
              </option>
            ))}
          </select>
          
          <Button
            onClick={() => setShowFilters(true)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filters
          </Button>
        </div>
        
        <Button
          onClick={() => setShowExport(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 hover:from-orange-600 hover:to-red-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{reportData.totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{getCompletionRate()}%</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Active Projects</p>
              <p className="text-2xl font-bold text-white">{reportData.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Overdue Tasks</p>
              <p className="text-2xl font-bold text-white">{reportData.overdueTasks}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Task Status Distribution</h3>
          <TasksChart data={reportData} />
        </Card>

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Project Progress</h3>
          <ProjectProgressChart />
        </Card>

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Team Productivity</h3>
          <TeamProductivityChart />
        </Card>
      </div>

      {/* Modals */}
      <ReportFiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={(filters) => {
          console.log('Applied filters:', filters);
          setShowFilters(false);
        }}
      />

      <ExportReportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        reportData={reportData}
      />
    </div>
  );
};