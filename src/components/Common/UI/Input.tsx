import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  transparent?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, helperText, leftIcon, rightIcon, transparent = false, className, ...props },
  ref
) => {
  const inputClasses = cn(
    'w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors',
    {
      // Transparent styles
      'bg-transparent border-gray-400 text-white placeholder-gray-300 focus:ring-blue-400 focus:border-blue-400': transparent && !error,
      'bg-transparent border-red-400 text-white placeholder-gray-300 focus:ring-red-400 focus:border-red-400': transparent && error,
      // Default styles
      'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500': !transparent && !error,
      'bg-white border-red-500 text-gray-900 focus:ring-red-500 focus:border-red-500': !transparent && error,
      'pl-10': leftIcon,
      'pr-10': rightIcon
    },
    className
  );

  const labelClasses = cn(
    'block text-sm font-medium mb-1',
    {
      'text-white': transparent,
      'text-gray-700': !transparent
    }
  );

  const errorClasses = cn(
    'mt-1 text-sm',
    {
      'text-red-300': transparent,
      'text-red-600': !transparent
    }
  );

  const helperClasses = cn(
    'mt-1 text-sm',
    {
      'text-gray-300': transparent,
      'text-gray-500': !transparent
    }
  );

  return (
    <div className="w-full">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className={errorClasses}>{error}</p>
      )}
      {helperText && !error && (
        <p className={helperClasses}>{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';