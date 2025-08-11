'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  deviceTrust: boolean;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: Date;
  current: boolean;
}

export function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true,
    deviceTrust: false,
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [activeSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: new Date(),
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      current: false,
    },
  ]);
  
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully');
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    // Simulate API call to terminate session
    console.log('Terminating session:', sessionId);
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours === 0) return 'Active now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Security</h2>
        <p className="text-white/60">Manage your account security and privacy settings</p>
      </div>

      {/* Change Password */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            loading={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Enable 2FA</div>
              <div className="text-white/60 text-sm">Add an extra layer of security to your account</div>
            </div>
            <Button
              onClick={toggleTwoFactor}
              loading={loading}
              className={`${settings.twoFactorEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
            >
              {settings.twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
          {settings.twoFactorEnabled && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="text-green-400 text-sm font-medium">✓ Two-factor authentication is enabled</div>
              <div className="text-green-300/80 text-xs mt-1">Your account is protected with 2FA</div>
            </div>
          )}
        </div>
      </div>

      {/* Security Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Security Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Login Notifications</div>
              <div className="text-white/60 text-sm">Get notified when someone logs into your account</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.loginNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, loginNotifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Trust This Device</div>
              <div className="text-white/60 text-sm">Skip 2FA on this device for 30 days</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deviceTrust}
                onChange={(e) => setSettings(prev => ({ ...prev, deviceTrust: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-white font-medium mb-2">Session Timeout</div>
            <div className="text-white/60 text-sm mb-3">Automatically log out after inactivity</div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15} className="bg-gray-800">15 minutes</option>
              <option value={30} className="bg-gray-800">30 minutes</option>
              <option value={60} className="bg-gray-800">1 hour</option>
              <option value={240} className="bg-gray-800">4 hours</option>
              <option value={0} className="bg-gray-800">Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium flex items-center space-x-2">
                    <span>{session.device}</span>
                    {session.current && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Current</span>
                    )}
                  </div>
                  <div className="text-white/60 text-sm">
                    {session.location} • {formatLastActive(session.lastActive)}
                  </div>
                </div>
              </div>
              {!session.current && (
                <Button
                  onClick={() => terminateSession(session.id)}
                  className="bg-red-500 hover:bg-red-600 text-white border-0 text-sm px-3 py-1"
                >
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}