'use client';

import React from 'react';
import { Button } from '@/components/Common/UI/Button';
import { useTheme } from '@/context/ThemeContext';
import { useCalendarContext } from './CalendarProvider';

export function CalendarFilters() {
  const { isDark } = useTheme();
  const { filters, setFilters } = useCalendarContext();

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      priority: 'all',
      status: 'all',
      view: filters.view,
      selectedDate: filters.selectedDate
    });
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || 
                          filters.priority !== 'all' || filters.status !== 'all';

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="min-w-[140px]">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="all">All Types</option>
            <option value="task">Task</option>
            <option value="meeting">Meeting</option>
            <option value="reminder">Reminder</option>
            <option value="deadline">Deadline</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="min-w-[140px]">
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="min-w-[140px]">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}