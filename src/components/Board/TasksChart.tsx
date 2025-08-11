'use client';

import React from 'react';

interface ReportData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
}

interface TasksChartProps {
  data: ReportData;
}

export const TasksChart: React.FC<TasksChartProps> = ({ data }) => {
  const pendingTasks = data.totalTasks - data.completedTasks - data.inProgressTasks - data.overdueTasks;
  
  const chartData = [
    { label: 'Completed', value: data.completedTasks, color: 'text-green-400', bg: 'bg-green-400' },
    { label: 'In Progress', value: data.inProgressTasks, color: 'text-blue-400', bg: 'bg-blue-400' },
    { label: 'Pending', value: pendingTasks, color: 'text-gray-400', bg: 'bg-gray-400' },
    { label: 'Overdue', value: data.overdueTasks, color: 'text-red-400', bg: 'bg-red-400' }
  ];

  const total = data.totalTasks;
  let cumulativePercentage = 0;

  return (
    <div className="flex items-center justify-center space-x-8">
      {/* Donut Chart */}
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {chartData.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage * 2.51} ${251 - percentage * 2.51}`;
            const strokeDashoffset = -cumulativePercentage * 2.51;
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={item.bg.replace('bg-', '').replace('400', '') === 'green' ? '#10b981' : 
                       item.bg.replace('bg-', '').replace('400', '') === 'blue' ? '#3b82f6' :
                       item.bg.replace('bg-', '').replace('400', '') === 'gray' ? '#9ca3af' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-white/60">Total Tasks</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${item.bg}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">{item.label}</span>
                <span className="text-white/80 text-sm font-medium">{item.value}</span>
              </div>
              <div className="text-white/60 text-xs">
                {((item.value / total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};