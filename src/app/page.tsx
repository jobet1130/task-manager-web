import React from 'react';
import { HeroSection } from '@/components/Common/Landing/HeroSection';
import { FeaturesSection } from '@/components/Common/Landing/FeatureSection';
import { TestimonialsSection } from '@/components/Common/Landing/TestimonialsSection';
import { CTASection } from '@/components/Common/Landing/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}