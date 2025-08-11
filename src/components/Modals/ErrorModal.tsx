'use client';

import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = 'Authentication Error',
  message,
  type = 'error'
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-red-400';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'error': return 'from-red-500/20 to-red-600/20 border-red-500/40';
      case 'warning': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/40';
      case 'info': return 'from-blue-500/20 to-blue-600/20 border-blue-500/40';
      default: return 'from-red-500/20 to-red-600/20 border-red-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Background Design */}
        <div className="absolute inset-0 -z-10">
          {/* Glassmorphism background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getBgColor()} backdrop-blur-md rounded-2xl border shadow-2xl`} />
          
          {/* Animated gradient orbs */}
          <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-red-400/30 to-orange-500/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-r from-orange-400/30 to-red-500/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Modal Content */}
        <div className="relative z-10 bg-transparent p-6">
          <div className="text-center">
            {/* Icon */}
            <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm mb-4`}>
              {type === 'error' && (
                <svg className={`w-6 h-6 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {type === 'warning' && (
                <svg className={`w-6 h-6 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {type === 'info' && (
                <svg className={`w-6 h-6 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">
              {title}
            </h3>
            
            {/* Message */}
            <p className="text-gray-200 mb-6 drop-shadow-md">
              {message}
            </p>
            
            {/* Actions */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-lg text-white font-medium transition-all duration-200 backdrop-blur-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};