'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BackToDashboardButtonProps {
  variant?: 'default' | 'compact' | 'floating';
  className?: string;
}

export const BackToDashboardButton: React.FC<BackToDashboardButtonProps> = ({
  variant = 'default',
  className
}) => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const variants = {
    default: 'px-6 py-3 bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent',
    compact: 'px-4 py-2 bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50',
    floating: 'fixed top-6 left-6 z-50 p-3 bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl'
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleBackToDashboard}
        className={cn(variants[variant], className)}
        title="Back to Dashboard"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleBackToDashboard}
      className={cn(
        'inline-flex items-center gap-2 font-medium',
        variants[variant],
        className
      )}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      Back to Dashboard
    </button>
  );
};