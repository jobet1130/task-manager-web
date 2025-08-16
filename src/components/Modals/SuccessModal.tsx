'use client';

import React, { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = 'Success!',
  message,
  autoClose = true,
  autoCloseDelay = 3000
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Modal Content */}
        <div className="relative z-10 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md rounded-2xl border border-green-400/30 shadow-2xl p-6">
          <div className="text-center">
            {/* Success Icon with Animation */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 backdrop-blur-sm mb-4 animate-bounce">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">
              {title}
            </h3>
            
            {/* Message */}
            <p className="text-green-100 mb-6 drop-shadow-md">
              {message}
            </p>
            
            {/* Progress Bar for Auto Close */}
            {autoClose && (
              <div className="w-full bg-white/20 rounded-full h-1 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"
                  style={{
                    animation: `shrink ${autoCloseDelay}ms linear forwards`
                  }}
                />
              </div>
            )}
            
            {/* Action Button */}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/40 hover:border-green-400/60 rounded-lg text-green-100 font-medium transition-all duration-200 backdrop-blur-sm"
            >
              Great!
            </button>
          </div>
        </div>
      </div>
      
      {/* CSS Animation for Progress Bar */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};