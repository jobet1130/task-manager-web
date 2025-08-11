import React from 'react';
import Link from 'next/link';
import { Button } from '../UI/Button';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section className={cn(
      "relative min-h-screen flex items-center justify-center overflow-hidden",
      "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
      className
    )}>
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight animate-fade-in-up">
            Organize Your
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tasks Efficiently
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Streamline your workflow with our powerful task management platform. 
            Collaborate with your team, track progress, and achieve your goals faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up animation-delay-400">
            <Link href="/login">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/watch-demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
              >
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 animate-fade-in-up animation-delay-600">
            <p className="text-sm text-gray-500 mb-6">Trusted by 10,000+ teams worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400 animate-slide-in-left animation-delay-800">TaskFlow</div>
              <div className="text-2xl font-bold text-gray-400 animate-slide-in-left animation-delay-1000">Microsoft</div>
              <div className="text-2xl font-bold text-gray-400 animate-slide-in-left animation-delay-1200">Google</div>
              <div className="text-2xl font-bold text-gray-400 animate-slide-in-left animation-delay-1400">Slack</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};