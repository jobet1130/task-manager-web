import React from 'react';
import { DemoHeader } from '@/components/Common/Demo/DemoHeader';
import { DemoHero } from '@/components/Common/Demo/DemoHero';
import { DemoVideo } from '@/components/Common/Demo/DemoVideo';
import { DemoFeatures } from '@/components/Common/Demo/DemoFeatures';
import { DemoCTA } from '@/components/Common/Demo/DemoCTA';
import { DemoFooter } from '@/components/Common/Demo/DemoFooter';

export default function WatchDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DemoHeader />
      <main>
        <DemoHero />
        <DemoVideo />
        <DemoFeatures />
        <DemoCTA />
      </main>
      <DemoFooter />
    </div>
  );
}