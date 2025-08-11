'use client';

import React from 'react';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h4 className="text-base font-medium text-white mb-1">{title}</h4>
        {description && (
          <p className="text-sm text-white/60">{description}</p>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};