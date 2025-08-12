'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface FilterOptions {
  dateRange: string;
  projects: string[];
  assignees: string[];
  priority: string[];
  status: string[];
}

interface ReportsContextType {
  reportData: ReportData;
  filters: FilterOptions;
  selectedPeriod: string;
  isLoading: boolean;
  updateFilters: (filters: FilterOptions) => void;
  updatePeriod: (period: string) => void;
  refreshData: () => Promise<void>;
  exportReport: (format: string, options: ErrorOptions) => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

interface ReportsProviderProps {
  children: ReactNode;
}

export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  const [reportData, setReportData] = useState<ReportData>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
    teamMembers: 0,
    avgCompletionTime: 0
  });

  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: '30d',
    projects: [],
    assignees: [],
    priority: [],
    status: []
  });

  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const updateFilters = async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    await refreshData();
  };

  const updatePeriod = async (period: string) => {
    setSelectedPeriod(period);
    await refreshData();
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch data based on filters and period
      // For now, we'll return empty data for all periods
      setReportData({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        totalProjects: 0,
        activeProjects: 0,
        teamMembers: 0,
        avgCompletionTime: 0
      });
    } catch (error) {
      console.error('Failed to refresh report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async (format: string, options: ErrorOptions) => {
    setIsLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call an API to generate the report
      console.log(`Exporting report in ${format} format with options:`, options);
      
      // Create a sample export file
      const exportData = {
        reportData,
        filters,
        period: selectedPeriod,
        generatedAt: new Date().toISOString(),
        format,
        options
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: ReportsContextType = {
    reportData,
    filters,
    selectedPeriod,
    isLoading,
    updateFilters,
    updatePeriod,
    refreshData,
    exportReport
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = (): ReportsContextType => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};