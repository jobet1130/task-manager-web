'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
  className
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h4 className={`text-base font-medium mb-1 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{title}</h4>
        {description && (
          <p className={`text-sm ${
            isDark ? 'text-white/60' : 'text-gray-600'
          }`}>{description}</p>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};