'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  className
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "backdrop-blur-sm rounded-xl p-6 transition-all duration-200",
      isDark 
        ? "bg-white/5 border border-white/10 hover:bg-white/10" 
        : "bg-gray-50/50 border border-gray-200/50 hover:bg-gray-100/50",
      className
    )}>
      <div className="mb-4">
        <h3 className={`text-lg font-semibold mb-1 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{title}</h3>
        {description && (
          <p className={`text-sm ${
            isDark ? 'text-white/60' : 'text-gray-600'
          }`}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};