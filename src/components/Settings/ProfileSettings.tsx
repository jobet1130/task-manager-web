'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SettingsCard } from './Common/SettingsCard';
import { SettingsSection } from './Common/SettingsSection';
import { Button } from '@/components/Common/UI/Button';

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
    <div className="space-y-6">
      <SettingsSection 
        title="Profile" 
        description="Manage your personal information and preferences"
      >
        {/* Avatar Section */}
        <SettingsCard title="Profile Picture">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 overflow-hidden relative">
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
                <div className="w-full h-full flex items-center justify-center text-white/60">
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
                className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-colors"
              >
                Upload Photo
              </label>
              <p className="text-white/60 text-sm mt-2">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </SettingsCard>

        {/* Personal Information */}
        <SettingsCard title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">First Name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Last Name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </SettingsCard>

        {/* Preferences */}
        <SettingsCard title="Preferences">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz} className="bg-gray-800">{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Language</label>
              <select
                value={profile.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800">{lang.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Date Format</label>
              <select
                value={profile.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateFormats.map(format => (
                  <option key={format} value={format} className="bg-gray-800">{format}</option>
                ))}
              </select>
            </div>
          </div>
        </SettingsCard>

        {/* Save Button */}
        <div className="pt-6 border-t border-white/20">
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
  );
}