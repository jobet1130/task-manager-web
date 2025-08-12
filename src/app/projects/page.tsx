'use client';

import React from 'react';
import { DashboardLayout } from '@/components/Board/DashboardLayout';
import { ProjectsHeader } from '@/components/Project/ProjectsHeader';
import { ProjectsFilters } from '@/components/Project/ProjectsFilters';
import { ProjectsList } from '@/components/Project/ProjectsList';
import { ProjectsStats } from '@/components/Project/ProjectsStats';
import { ProjectProvider } from '@/components/Project/ProjectProvider';

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <ProjectProvider>
        <div className="space-y-6">
          <ProjectsHeader />
          <ProjectsStats />
          <ProjectsFilters />
          <ProjectsList />
        </div>
      </ProjectProvider>
    </DashboardLayout>
  );
}