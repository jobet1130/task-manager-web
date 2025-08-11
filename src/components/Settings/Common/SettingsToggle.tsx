'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex-1">
        <label className={`text-sm font-medium cursor-pointer ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {label}
        </label>
        {description && (
          <p className={`text-xs mt-1 ${
            isDark ? 'text-white/60' : 'text-gray-600'
          }`}>{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isDark ? "focus:ring-offset-gray-900" : "focus:ring-offset-white",
          checked ? "bg-blue-600" : (isDark ? "bg-gray-600" : "bg-gray-300"),
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full transition-transform",
            isDark ? "bg-white" : "bg-white",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};