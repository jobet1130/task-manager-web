'use client';

import React, { useState } from 'react';
import { Button } from '../Common/UI/Button';
import { Input } from '../Common/UI/Input';

interface InviteData {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  message?: string;
}

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inviteData: InviteData) => Promise<void>;
  loading?: boolean;
}

export const InviteTeamModal: React.FC<InviteTeamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<InviteData>({
    email: '',
    role: 'member',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<InviteData>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<InviteData> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        email: '',
        role: 'member',
        message: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
  };

  const handleInputChange = (field: keyof InviteData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Background Design */}
        <div className="absolute inset-0 -z-10">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl border border-blue-500/40 shadow-2xl" />
          
          {/* Animated gradient orbs */}
          <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-r from-purple-400/30 to-blue-500/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Modal Content */}
        <div className="relative z-10 bg-transparent p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Invite Team Member</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter team member's email"
                className={`w-full bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as 'admin' | 'member' | 'viewer')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="viewer" className="bg-gray-800 text-white">Viewer - Can view projects and tasks</option>
                <option value="member" className="bg-gray-800 text-white">Member - Can create and edit tasks</option>
                <option value="admin" className="bg-gray-800 text-white">Admin - Full access to project settings</option>
              </select>
            </div>

            {/* Optional Message */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Add a personal message to the invitation..."
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                disabled={loading || !formData.email.trim()}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Invitation</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};