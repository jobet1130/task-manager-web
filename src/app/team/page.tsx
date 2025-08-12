'use client';

import React from 'react';
import { DashboardLayout } from '@/components/Board/DashboardLayout';
import { TeamProvider } from '@/components/Team/TeamProvider';
import { TeamPage } from '@/components/Team/TeamPage';

export default function Team() {
  return (
    <DashboardLayout>
      <TeamProvider>
        <TeamPage />
      </TeamProvider>
    </DashboardLayout>
  );
}