'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';
import { useReports } from './ReportsProvider';
import { ReportFiltersModal } from '@/components/Common/UI/ReportFiltersModal';
import { ExportReportModal } from '@/components/Modals/ExportReportModal';

export const ReportsHeader: React.FC = () => {
  const { selectedPeriod, updatePeriod, isLoading, reportData, updateFilters } = useReports();
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-white/80">Track your team&apos;s performance and project progress</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => updatePeriod(e.target.value)}
            disabled={isLoading}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value} className="bg-gray-800">
                {period.label}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <Button
            onClick={() => window.location.reload()}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="border border-white/20 text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>

          {/* Filters Button */}
          <Button
            onClick={() => setShowFilters(true)}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="border border-white/20 text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filters
          </Button>

          {/* Export Button */}
          <Button
            onClick={() => setShowExport(true)}
            disabled={isLoading}
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 hover:from-orange-600 hover:to-red-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </Button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 text-white/80">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Loading report data...</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <ReportFiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={(filters) => {
          updateFilters(filters);
          setShowFilters(false);
        }}
      />

      <ExportReportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        reportData={reportData}
      />
    </>
  );
};