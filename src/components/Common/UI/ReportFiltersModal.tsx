'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';

interface FilterOptions {
  dateRange: string;
  projects: string[];
  assignees: string[];
  priority: string[];
  status: string[];
}

interface ReportFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export const ReportFiltersModal: React.FC<ReportFiltersModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: '30d',
    projects: [],
    assignees: [],
    priority: [],
    status: []
  });

  if (!isOpen) return null;

  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma'];
  const assignees = ['John Doe', 'Jane Smith', 'Mike Johnson'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['To Do', 'In Progress', 'Review', 'Done'];

  const handleCheckboxChange = (category: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? (prev[category] as string[]).filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      dateRange: '30d',
      projects: [],
      assignees: [],
      priority: [],
      status: []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl border border-blue-500/40 shadow-2xl" />
        </div>
        
        <div className="relative z-10 bg-transparent p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Report Filters</h2>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d" className="bg-gray-800">Last 7 days</option>
                <option value="30d" className="bg-gray-800">Last 30 days</option>
                <option value="90d" className="bg-gray-800">Last 3 months</option>
                <option value="1y" className="bg-gray-800">Last year</option>
              </select>
            </div>

            {/* Projects */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Projects</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {projects.map(project => (
                  <label key={project} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={filters.projects.includes(project)}
                      onChange={() => handleCheckboxChange('projects', project)}
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm">{project}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Assignees */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Assignees</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {assignees.map(assignee => (
                  <label key={assignee} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={filters.assignees.includes(assignee)}
                      onChange={() => handleCheckboxChange('assignees', assignee)}
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm">{assignee}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Priority</label>
              <div className="flex flex-wrap gap-2">
                {priorities.map(priority => (
                  <label key={priority} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority)}
                      onChange={() => handleCheckboxChange('priority', priority)}
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                  <label key={status} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleCheckboxChange('status', status)}
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-6 mt-6 border-t border-white/20">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};