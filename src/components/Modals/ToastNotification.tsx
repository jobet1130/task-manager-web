'use client';

import React, { useEffect, useState } from 'react';

interface ToastNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  isVisible,
  onClose,
  message,
  type = 'success',
  duration = 4000,
  position = 'top-right'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
      default: return 'top-4 right-4';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500/20 to-emerald-600/20 border-green-400/30',
          icon: 'text-green-400',
          text: 'text-green-100'
        };
      case 'error':
        return {
          bg: 'from-red-500/20 to-red-600/20 border-red-400/30',
          icon: 'text-red-400',
          text: 'text-red-100'
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/20 to-orange-600/20 border-yellow-400/30',
          icon: 'text-yellow-400',
          text: 'text-yellow-100'
        };
      case 'info':
        return {
          bg: 'from-blue-500/20 to-blue-600/20 border-blue-400/30',
          icon: 'text-blue-400',
          text: 'text-blue-100'
        };
      default:
        return {
          bg: 'from-green-500/20 to-emerald-600/20 border-green-400/30',
          icon: 'text-green-400',
          text: 'text-green-100'
        };
    }
  };

  const styles = getTypeStyles();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()} transition-all duration-300 transform ${
      isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
    }`}>
      <div className="relative max-w-sm">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} backdrop-blur-md rounded-lg border shadow-lg`} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-4 flex items-center space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <p className={`text-sm font-medium ${styles.text}`}>
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className={`flex-shrink-0 ${styles.icon} hover:opacity-70 transition-opacity`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${type === 'success' ? 'from-green-400 to-emerald-500' : 
              type === 'error' ? 'from-red-400 to-red-500' :
              type === 'warning' ? 'from-yellow-400 to-orange-500' :
              'from-blue-400 to-blue-500'
            } transition-all duration-300`}
            style={{
              width: isAnimating ? '0%' : '100%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  );
};