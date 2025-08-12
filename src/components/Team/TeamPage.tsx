'use client';

import React, { useState } from 'react';
import { TeamOverview } from './TeamOverview';
import { TeamList } from './TeamList';
import { useTeam } from './TeamProvider';
import { InviteTeamModal } from '../Modals/InviteTeamModal';
import { ToastNotification } from '../Modals/ToastNotification';
import { useTheme } from '@/context/ThemeContext';

export const TeamPage: React.FC = () => {
  const { members, stats, inviteMember } = useTeam();
  const { isDark } = useTheme();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleViewProfile = (memberId: string) => {
    console.log('View profile for member:', memberId);
    // Implement profile view logic
  };

  const handleSendMessage = (memberId: string) => {
    console.log('Send message to member:', memberId);
    // Implement messaging logic
  };

  const handleInviteMember = async (inviteData: { email: string; role: 'admin' | 'member' | 'viewer'; message?: string }) => {
    setLoading(true);
    try {
      await inviteMember(inviteData.email, inviteData.role);
      setToastMessage(`Invitation sent to ${inviteData.email}`);
      setShowToast(true);
      setShowInviteModal(false);
    } catch (error) {
      setToastMessage('Failed to send invitation. Please try again.');
      setShowToast(true);
      console.log('Error inviting member:', error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Team
          </h1>
          <p className={`mt-2 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your team members and collaborate effectively
          </p>
        </div>

        {/* Team Overview */}
        <TeamOverview stats={stats} />

        {/* Team List */}
        <TeamList
          members={members}
          onViewProfile={handleViewProfile}
          onSendMessage={handleSendMessage}
          onInviteMember={() => setShowInviteModal(true)}
        />

        {/* Invite Team Modal */}
        <InviteTeamModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteMember}
          loading={loading}
        />

        {/* Toast Notification */}
        <ToastNotification
          isVisible={showToast}
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
};