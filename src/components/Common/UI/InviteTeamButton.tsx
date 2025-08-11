'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { InviteTeamModal } from '../../Modals/InviteTeamModal';
import { ToastNotification } from '../../Modals/ToastNotification';

interface InviteData {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  message?: string;
}

interface InviteTeamButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const InviteTeamButton: React.FC<InviteTeamButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'md'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleInviteSubmit = async (inviteData: InviteData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to send the invitation
      console.log('Sending invitation:', inviteData);
      
      // Show success notification
      setToastMessage(`Invitation sent to ${inviteData.email}`);
      setShowToast(true);
      
    } catch (error) {
      console.error('Failed to send invitation:', error);
      setToastMessage('Failed to send invitation. Please try again.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant === 'default' ? 'primary' : variant}
        size={size}
        className={`w-full h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 ${className}`}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        Invite Team
      </Button>

      <InviteTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInviteSubmit}
        loading={loading}
      />

      <ToastNotification
        isVisible={showToast}
        message={toastMessage}
        type="success"
        onClose={() => setShowToast(false)}
        duration={4000}
      />
    </>
  );
};