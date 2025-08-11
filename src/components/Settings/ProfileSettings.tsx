'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SettingsCard } from './Common/SettingsCard';
import { SettingsSection } from './Common/SettingsSection';
import { Button } from '@/components/Common/UI/Button';
import { useTheme } from '@/context/ThemeContext';
import { SettingsConfirmationModal } from '@/components/Modals/SettingsConfirmationModal';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  timezone: string;
  language: string;
  dateFormat: string;
}

export function ProfileSettings() {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  });
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    // Load saved profile data
    const saved = localStorage.getItem('profileData');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('profileData', JSON.stringify(profile));
      setShowSaveModal(true);
    } finally {
      setLoading(false);
    }
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
  ];

  const dateFormats = [
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY-MM-DD',
    'DD MMM YYYY',
  ];

  return (
    <>
      <div className="space-y-6">
        <SettingsSection 
          title="Profile" 
          description="Manage your personal information and preferences"
        >
          {/* Avatar Section */}
          <SettingsCard title="Profile Picture">
            <div className="flex items-center space-x-6">
              <div className={`w-24 h-24 rounded-full border-2 overflow-hidden relative ${
                isDark 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-gray-100 border-gray-300'
              }`}>
                {profile.avatar ? (
                  <Image 
                    src={profile.avatar} 
                    alt="Avatar" 
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority={false}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    isDark ? 'text-white/60' : 'text-gray-400'
                  }`}>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                  }`}
                >
                  Upload Photo
                </label>
                <p className={`text-sm mt-2 ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}>JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>
          </SettingsCard>

          {/* Personal Information */}
          <SettingsCard title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-white/80' : 'text-gray-700'
              }`}>Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Tell us about yourself..."
              />
            </div>
          </SettingsCard>

          {/* Preferences */}
          <SettingsCard title="Preferences">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Timezone</label>
                <select
                  value={profile.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz} className={isDark ? 'bg-gray-800' : 'bg-white'}>{tz}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Language</label>
                <select
                  value={profile.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className={isDark ? 'bg-gray-800' : 'bg-white'}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Date Format</label>
                <select
                  value={profile.dateFormat}
                  onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {dateFormats.map(format => (
                    <option key={format} value={format} className={isDark ? 'bg-gray-800' : 'bg-white'}>{format}</option>
                  ))}
                </select>
              </div>
            </div>
          </SettingsCard>

          {/* Save Button */}
          <div className={`pt-6 border-t ${
            isDark ? 'border-white/20' : 'border-gray-200'
          }`}>
            <Button 
              onClick={saveProfile}
              loading={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
            >
              Save Profile
            </Button>
          </div>
        </SettingsSection>
      </div>
      
      <SettingsConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        settingType="profiles"
        autoClose={true}
        autoCloseDelay={2500}
      />
    </>
  );
}