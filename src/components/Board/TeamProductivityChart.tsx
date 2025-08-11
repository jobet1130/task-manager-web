'use client';

import React from 'react';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  tasksCompleted: number;
  tasksInProgress: number;
  efficiency: number;
  color: string;
}

interface ProductivityData {
  date: string;
  tasksCompleted: number;
  teamEfficiency: number;
}

export const TeamProductivityChart: React.FC = () => {
  // Sample team data - in a real app, this would come from props or API
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      tasksCompleted: 24,
      tasksInProgress: 3,
      efficiency: 92,
      color: '#3B82F6'
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'MC',
      tasksCompleted: 18,
      tasksInProgress: 5,
      efficiency: 87,
      color: '#10B981'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'ER',
      tasksCompleted: 21,
      tasksInProgress: 2,
      efficiency: 95,
      color: '#F59E0B'
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'DK',
      tasksCompleted: 15,
      tasksInProgress: 4,
      efficiency: 78,
      color: '#8B5CF6'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      avatar: 'LW',
      tasksCompleted: 19,
      tasksInProgress: 3,
      efficiency: 89,
      color: '#EF4444'
    }
  ];

  // Sample productivity trend data for the last 7 days
  const productivityTrend: ProductivityData[] = [
    { date: 'Mon', tasksCompleted: 45, teamEfficiency: 85 },
    { date: 'Tue', tasksCompleted: 52, teamEfficiency: 88 },
    { date: 'Wed', tasksCompleted: 38, teamEfficiency: 82 },
    { date: 'Thu', tasksCompleted: 61, teamEfficiency: 91 },
    { date: 'Fri', tasksCompleted: 48, teamEfficiency: 87 },
    { date: 'Sat', tasksCompleted: 35, teamEfficiency: 89 },
    { date: 'Sun', tasksCompleted: 42, teamEfficiency: 86 }
  ];

  const maxTasks = Math.max(...productivityTrend.map(d => d.tasksCompleted));
  const avgEfficiency = Math.round(
    teamMembers.reduce((sum, member) => sum + member.efficiency, 0) / teamMembers.length
  );
  const totalTasksCompleted = teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-400';
    if (efficiency >= 80) return 'text-blue-400';
    if (efficiency >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-white/80 text-sm">Team Efficiency</p>
          <p className={`text-2xl font-bold ${getEfficiencyColor(avgEfficiency)}`}>
            {avgEfficiency}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-white/80 text-sm">Tasks Completed</p>
          <p className="text-2xl font-bold text-white">{totalTasksCompleted}</p>
        </div>
        <div className="text-center">
          <p className="text-white/80 text-sm">Active Members</p>
          <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
        </div>
      </div>

      {/* Productivity Trend Chart */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-4">Weekly Productivity Trend</h4>
        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 400 120">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="40"
                y1={100 - y * 0.8 + 10}
                x2="380"
                y2={100 - y * 0.8 + 10}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            
            {/* Trend line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              points={productivityTrend
                .map((point, index) => {
                  const x = 40 + (index * 50);
                  const y = 100 - (point.tasksCompleted / maxTasks) * 80 + 10;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            
            {/* Data points */}
            {productivityTrend.map((point, index) => {
              const x = 40 + (index * 50);
              const y = 100 - (point.tasksCompleted / maxTasks) * 80 + 10;
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y="115"
                    textAnchor="middle"
                    className="text-xs fill-white/60"
                  >
                    {point.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Team Members Performance */}
      <div>
        <h4 className="text-white font-medium mb-4">Team Performance</h4>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-4">
              {/* Avatar */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: member.color }}
              >
                {member.avatar}
              </div>
              
              {/* Member Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{member.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-white/80 text-xs">
                      {member.tasksCompleted} completed
                    </span>
                    <span className={`text-xs font-medium ${getEfficiencyColor(member.efficiency)}`}>
                      {member.efficiency}%
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${member.efficiency}%`,
                        backgroundColor: member.color,
                        boxShadow: `0 0 8px ${member.color}40`
                      }}
                    />
                  </div>
                  <span className="text-white/60 text-xs w-8">
                    {member.tasksInProgress}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Legend */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Excellent (90%+)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Good (80-89%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Fair (70-79%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Needs Improvement (&lt;70%)</span>
            </div>
          </div>
          <span>Right number shows tasks in progress</span>
        </div>
      </div>
    </div>
  );
};