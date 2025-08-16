'use client';

import React, { useState } from 'react';
import { Button } from '../Common/UI/Button';

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

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData;
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  includeTeamData: boolean;
  includeProjectData: boolean;
  dateRange: string;
  fileName: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  reportData
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeTeamData: true,
    includeProjectData: true,
    dateRange: '30d',
    fileName: `report-${new Date().toISOString().split('T')[0]}`
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressSteps = [20, 40, 60, 80, 100];
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setExportProgress(step);
      }

      // In a real application, this would call an API to generate and download the report
      console.log('Exporting report with options:', exportOptions);
      console.log('Report data:', reportData);

      // Simulate file download
      const blob = new Blob([JSON.stringify({ reportData, exportOptions }, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportOptions.fileName}.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Close modal after successful export
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const formatOptions = [
    { value: 'pdf', label: '📄 PDF Document', description: 'Professional report with charts' },
    { value: 'excel', label: '📊 Excel Spreadsheet', description: 'Data tables and analysis' },
    { value: 'csv', label: '📋 CSV File', description: 'Raw data for processing' },
    { value: 'json', label: '🔧 JSON Data', description: 'Structured data format' }
  ];

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Background Design */}
        <div className="absolute inset-0 -z-10">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 backdrop-blur-md rounded-2xl border border-orange-500/40 shadow-2xl" />
        </div>
        
        {/* Modal Content */}
        <div className="relative z-10 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Export Report</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isExporting}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Generating report...</span>
                <span className="text-white text-sm">{exportProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formatOptions.map((format) => (
                  <label
                    key={format.value}
                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      exportOptions.format === format.value
                        ? 'border-orange-400/60 bg-white/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={exportOptions.format === format.value}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as 'pdf' | 'excel' | 'csv' | 'json' }))}
                      disabled={isExporting}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{format.label}</div>
                      <div className="text-white/60 text-sm">{format.description}</div>
                    </div>
                    {exportOptions.format === format.value && (
                      <div className="text-orange-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* File Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                File Name
              </label>
              <input
                type="text"
                value={exportOptions.fileName}
                onChange={(e) => setExportOptions(prev => ({ ...prev, fileName: e.target.value }))}
                disabled={isExporting}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all backdrop-blur-sm disabled:opacity-50"
                placeholder="Enter file name"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Date Range
              </label>
              <select
                value={exportOptions.dateRange}
                onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value }))}
                disabled={isExporting}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all backdrop-blur-sm disabled:opacity-50"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Include Options */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                Include in Export
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCharts}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                    disabled={isExporting || exportOptions.format === 'csv' || exportOptions.format === 'json'}
                    className="w-4 h-4 text-orange-500 bg-white/10 border-white/30 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className={exportOptions.format === 'csv' || exportOptions.format === 'json' ? 'text-white/50' : ''}>
                    📊 Include Charts and Visualizations
                  </span>
                </label>
                
                <label className="flex items-center space-x-3 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTeamData}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeTeamData: e.target.checked }))}
                    disabled={isExporting}
                    className="w-4 h-4 text-orange-500 bg-white/10 border-white/30 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span>👥 Include Team Performance Data</span>
                </label>
                
                <label className="flex items-center space-x-3 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeProjectData}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeProjectData: e.target.checked }))}
                    disabled={isExporting}
                    className="w-4 h-4 text-orange-500 bg-white/10 border-white/30 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span>📋 Include Project Progress Data</span>
                </label>
              </div>
            </div>

            {/* Report Summary */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/20">
              <h4 className="text-white font-medium mb-3">Report Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Total Tasks:</span>
                  <span className="text-white ml-2">{reportData.totalTasks}</span>
                </div>
                <div>
                  <span className="text-white/60">Completed:</span>
                  <span className="text-white ml-2">{reportData.completedTasks}</span>
                </div>
                <div>
                  <span className="text-white/60">Active Projects:</span>
                  <span className="text-white ml-2">{reportData.activeProjects}</span>
                </div>
                <div>
                  <span className="text-white/60">Team Members:</span>
                  <span className="text-white ml-2">{reportData.teamMembers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-white/20">
            <Button
              onClick={onClose}
              variant="ghost"
              disabled={isExporting}
              className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || !exportOptions.fileName.trim()}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};