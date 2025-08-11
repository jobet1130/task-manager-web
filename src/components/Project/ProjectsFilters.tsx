'use client';

import React from 'react';
import { Button } from '@/components/Common/UI/Button';
import { useTheme } from '@/context/ThemeContext';
import { useProjectContext } from './ProjectProvider';

export function ProjectsFilters() {
  const { isDark } = useTheme();
  const { filters, setFilters } = useProjectContext();

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      visibility: 'all',
      template: 'all',
      sortBy: 'updatedAt',
      view: filters.view
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || 
                          filters.visibility !== 'all' || filters.template !== 'all';

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Visibility Filter */}
        <div className="min-w-[140px]">
          <select
            value={filters.visibility}
            onChange={(e) => handleFilterChange('visibility', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="all">All Visibility</option>
            <option value="private">Private</option>
            <option value="team">Team</option>
            <option value="public">Public</option>
          </select>
        </div>

        {/* Template Filter */}
        <div className="min-w-[140px]">
          <select
            value={filters.template}
            onChange={(e) => handleFilterChange('template', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="all">All Templates</option>
            <option value="blank">Blank</option>
            <option value="kanban">Kanban</option>
            <option value="scrum">Scrum</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="min-w-[140px]">
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Created Date</option>
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex border rounded-md overflow-hidden">
          <button
            onClick={() => handleFilterChange('view', 'grid')}
            className={`px-3 py-2 text-sm ${
              filters.view === 'grid'
                ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => handleFilterChange('view', 'list')}
            className={`px-3 py-2 text-sm ${
              filters.view === 'list'
                ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
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