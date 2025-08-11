'use client';

import React from 'react';
import { DashboardLayout } from '@/components/Board/DashboardLayout';
import { CalendarHeader } from '@/components/Calendar/CalendarHeader';
import { CalendarStats } from '@/components/Calendar/CalendarStats';
import { CalendarFilters } from '@/components/Calendar/CalendarFilters';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { CalendarProvider } from '@/components/Calendar/CalendarProvider';

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <CalendarProvider>
        <div className="space-y-6">
          <CalendarHeader />
          <CalendarStats />
          <CalendarFilters />
          <CalendarView />
        </div>
      </CalendarProvider>
    </DashboardLayout>
  );
}