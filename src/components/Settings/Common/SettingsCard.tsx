'use client';

import React from 'react';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn(
      "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6",
      "hover:bg-white/10 transition-all duration-200",
      className
    )}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-white/60">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};