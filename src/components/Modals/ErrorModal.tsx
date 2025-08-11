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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-48">
      {/* Modal */}
      <div className="relative w-full max-w-sm mx-auto">
        {/* Modal Content */}
        <div className="relative z-10 bg-gray-800/95 backdrop-blur-sm p-4 border border-white/20 rounded-xl shadow-xl">
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-full border border-white/20 mb-2">
              {type === 'error' && (
                <svg className={`w-4 h-4 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {type === 'warning' && (
                <svg className={`w-4 h-4 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {type === 'info' && (
                <svg className={`w-4 h-4 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-base font-semibold text-white mb-1">
              {title}
            </h3>
            
            {/* Message */}
            <p className="text-gray-200 text-sm mb-3">
              {message}
            </p>
            
            {/* Actions */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-4 py-1.5 border border-white/30 hover:border-white/50 rounded-lg text-white text-sm font-medium transition-all duration-200"
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