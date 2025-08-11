'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export function DashboardHeader() {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  // Calculate progress based on actual data (0% when no tasks)
  const totalTasks = 0; // Empty since we cleared the dashboard
  const completedTasks = 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (!mounted) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Good morning! 👋</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Loading...</p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Today&apos;s Progress</p>
            <div className="flex items-center mt-1">
              <div className={`w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mr-3`}>
                <div className="bg-primary h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Good morning! 👋</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{currentDate}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Today&apos;s Progress</p>
          <div className="flex items-center mt-1">
            <div className={`w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mr-3`}>
              <div className="bg-primary h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{progressPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}