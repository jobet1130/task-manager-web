'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Common/UI/Card';
import { useReports } from './ReportsProvider';

interface TaskStatusData {
  label: string;
  value: number;
  percentage: number;
  color: string;
  bgColor: string;
  description: string;
  trend?: string;
}

export const TaskStatusDistribution: React.FC = () => {
  const { reportData, isLoading } = useReports();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const pendingTasks = Math.max(0, reportData.totalTasks - reportData.completedTasks - reportData.inProgressTasks - reportData.overdueTasks);
  const total = reportData.totalTasks; // Use actual total
  const safeTotal = total || 1; // Only use for calculations to prevent division by zero
  
  // Then update the percentage calculations to use safeTotal:
  const statusData: TaskStatusData[] = [
    {
      label: 'Completed',
      value: reportData.completedTasks,
      percentage: (reportData.completedTasks / safeTotal) * 100,
      color: '#10b981',
      bgColor: 'bg-green-500',
      description: 'Tasks that have been successfully completed',
      trend: '+5.2%'
    },
    {
      label: 'In Progress',
      value: reportData.inProgressTasks,
      percentage: (reportData.inProgressTasks / safeTotal) * 100, // Changed from total to safeTotal
      color: '#3b82f6',
      bgColor: 'bg-blue-500',
      description: 'Tasks currently being worked on',
      trend: '+2.1%'
    },
    {
      label: 'Pending',
      value: pendingTasks,
      percentage: (pendingTasks / safeTotal) * 100, // Changed from total to safeTotal
      color: '#9ca3af',
      bgColor: 'bg-gray-500',
      description: 'Tasks waiting to be started',
      trend: '-1.8%'
    },
    {
      label: 'Overdue',
      value: reportData.overdueTasks,
      percentage: (reportData.overdueTasks / safeTotal) * 100, // Changed from total to safeTotal
      color: '#ef4444',
      bgColor: 'bg-red-500',
      description: 'Tasks that have passed their due date',
      trend: '-0.5%'
    }
  ];

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercentage = 0;

  const handleStatusClick = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4 w-48"></div>
          <div className="flex items-center justify-center space-x-8">
            <div className="w-40 h-40 bg-white/20 rounded-full"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                  <div className="h-4 bg-white/20 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Task Status Distribution</h3>
        <div className="text-sm text-white/60">
          Total: {total} tasks
        </div>
      </div>

      <div className="flex items-center justify-center space-x-8 mb-6">
        {/* Enhanced Donut Chart */}
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
            />
            
            {/* Status segments */}
            {statusData.map((status, index) => {
              const strokeDasharray = `${(status.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage * circumference / 100;
              const isSelected = selectedStatus === status.label;
              
              cumulativePercentage += status.percentage;
              
              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={status.color}
                  strokeWidth={isSelected ? "16" : "12"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  onClick={() => handleStatusClick(status.label)}
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 8px ${status.color})` : 'none'
                  }}
                />
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {selectedStatus ? (
                <>
                  <div className="text-3xl font-bold text-white">
                    {statusData.find(s => s.label === selectedStatus)?.value}
                  </div>
                  <div className="text-sm text-white/80">{selectedStatus}</div>
                  <div className="text-xs text-white/60">
                    {statusData.find(s => s.label === selectedStatus)?.percentage.toFixed(1)}%
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold text-white">{total}</div>
                  <div className="text-sm text-white/60">Total Tasks</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="space-y-4">
          {statusData.map((status, index) => {
            const isSelected = selectedStatus === status.label;
            return (
              <div
                key={index}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'
                }`}
                onClick={() => handleStatusClick(status.label)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${status.bgColor} transition-all duration-200`}
                    style={{
                      boxShadow: isSelected ? `0 0 8px ${status.color}` : 'none'
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium">{status.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white/80 text-sm font-bold">{status.value}</span>
                        {status.trend && (
                          <span className={`text-xs font-medium ${
                            status.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {status.trend}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white/60 text-xs">
                        {status.percentage.toFixed(1)}%
                      </div>
                      <div className="w-16 bg-white/10 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500`}
                          style={{
                            width: `${status.percentage}%`,
                            backgroundColor: status.color
                          }}
                        />
                      </div>
                    </div>
                    {isSelected && (
                      <div className="text-white/70 text-xs mt-2 leading-relaxed">
                        {status.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {((reportData.completedTasks / safeTotal) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-white/60">Completion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">
            {((reportData.inProgressTasks / safeTotal) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-white/60">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">
            {reportData.overdueTasks}
          </div>
          <div className="text-xs text-white/60">Overdue</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {reportData.totalTasks === 0 ? 0 : Math.round(reportData.completedTasks / (reportData.totalTasks / 7))}
          </div>
          <div className="text-xs text-white/60">Avg/Week</div>
        </div>
      </div>
    </Card>
  );
};