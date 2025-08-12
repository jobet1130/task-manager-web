'use client';

import React from 'react';
import { DashboardLayout } from '@/components/Board/DashboardLayout';
import { ReportsDashboard } from '@/components/Board/ReportsDashboard';
import { ReportsProvider } from '@/components/Reports/ReportsProvider';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <ReportsProvider>
        <div className="h-full">
          <ReportsDashboard />
        </div>
      </ReportsProvider>
    </DashboardLayout>
  );
}