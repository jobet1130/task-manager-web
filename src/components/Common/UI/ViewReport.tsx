'use client';

import React, { useState } from 'react';
import { ReportsModal } from '@/components/Modals/ReportsModal';
import { Button } from './Button';

interface ViewReportsButtonProps {
  onReportsViewed?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const ViewReportsButton: React.FC<ViewReportsButtonProps> = ({ 
  onReportsViewed,
  variant = 'default',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onReportsViewed) {
      onReportsViewed();
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        variant={variant === 'default' ? 'primary' : variant}
        className={`w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg flex items-center justify-center transition-all duration-200 ${className}`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        View Reports
      </Button>

      <ReportsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};