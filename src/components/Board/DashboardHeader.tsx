'use client';

import React from 'react';

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning! 👋</h1>
          <p className="text-gray-600 mt-1">{currentDate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today&apos;s Progress</p>
          <div className="flex items-center mt-1">
            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-700">65%</span>
          </div>
        </div>
      </div>
    </div>
  );
}