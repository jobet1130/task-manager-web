'use client';

import React, { useEffect } from 'react';

interface SettingsConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingType: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const SettingsConfirmationModal: React.FC<SettingsConfirmationModalProps> = ({
  isOpen,
  onClose,
  settingType,
  autoClose = true,
  autoCloseDelay = 2500
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

  const getSettingMessage = (type: string) => {
    switch (type) {
      case 'theme':
        return 'Theme preference updated successfully!';
      case 'accentColor':
        return 'Accent color changed successfully!';
      case 'fontSize':
        return 'Font size updated successfully!';
      case 'animations':
        return 'Animation settings updated successfully!';
      case 'notifications':
        return 'Notification preferences saved successfully!';
      case 'profiles':
        return 'Profile information saved successfully!';
      case 'password':
        return 'Password changed successfully!';
      default:
        return 'Settings updated successfully!';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-48 p-4">
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Modal Content */}
        <div className="relative z-10 bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl p-6">
          <div className="text-center">
            {/* Settings Icon with Animation */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-sm mb-4 animate-bounce">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">
              Settings Applied!
            </h3>
            
            {/* Message */}
            <p className="text-blue-100 mb-6 drop-shadow-md">
              {getSettingMessage(settingType)}
            </p>
            
            {/* Progress Bar for Auto Close */}
            {autoClose && (
              <div className="w-full bg-white/20 rounded-full h-1 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  style={{
                    animation: `shrink ${autoCloseDelay}ms linear forwards`
                  }}
                />
              </div>
            )}
            
            {/* Action Button */}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 hover:border-blue-400/60 rounded-lg text-blue-100 font-medium transition-all duration-200 backdrop-blur-sm"
            >
              Got it!
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