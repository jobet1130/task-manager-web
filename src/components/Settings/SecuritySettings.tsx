'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';
import { useTheme } from '@/context/ThemeContext';
import { SettingsConfirmationModal } from '@/components/Modals/SettingsConfirmationModal';
import { ErrorModal } from '../Modals/ErrorModal';

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
  const { isDark } = useTheme();
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = async () => {
    // Check if all password fields are filled
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setErrorMessage('Please fill in all password fields');
      setShowErrorModal(true);
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setShowErrorModal(true);
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success modal instead of alert
      setShowPasswordModal(true);
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setErrorMessage('Failed to change password');
      setShowErrorModal(true);
      console.error('Password change failed:', error);
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
    <>
      <div className="space-y-8">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Security</h2>
          <p className={isDark ? 'text-white/60' : 'text-gray-600'}>
            Manage your account security and privacy settings
          </p>
        </div>

        {/* Change Password */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Change Password</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-white/80' : 'text-gray-700'
              }`}>Current Password *</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
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
              }`}>New Password *</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
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
              }`}>Confirm New Password *</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
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
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Two-Factor Authentication</h3>
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Enable 2FA</div>
                <div className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}>Add an extra layer of security to your account</div>
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
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Security Preferences</h3>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div>
                <div className={`font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Login Notifications</div>
                <div className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}>Get notified when someone logs into your account</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.loginNotifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, loginNotifications: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                  isDark
                    ? 'bg-white/20 peer-checked:after:border-white after:bg-white'
                    : 'bg-gray-300 peer-checked:after:border-white after:bg-white'
                }`}></div>
              </label>
            </div>
            
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div>
                <div className={`font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Trust This Device</div>
                <div className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}>Skip 2FA on this device for 30 days</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.deviceTrust}
                  onChange={(e) => setSettings(prev => ({ ...prev, deviceTrust: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                  isDark
                    ? 'bg-white/20 peer-checked:after:border-white after:bg-white'
                    : 'bg-gray-300 peer-checked:after:border-white after:bg-white'
                }`}></div>
              </label>
            </div>
            
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className={`font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Session Timeout</div>
              <div className={`text-sm mb-3 ${
                isDark ? 'text-white/60' : 'text-gray-600'
              }`}>Automatically log out after inactivity</div>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value={15} className={isDark ? 'bg-gray-800' : 'bg-white'}>15 minutes</option>
                <option value={30} className={isDark ? 'bg-gray-800' : 'bg-white'}>30 minutes</option>
                <option value={60} className={isDark ? 'bg-gray-800' : 'bg-white'}>1 hour</option>
                <option value={240} className={isDark ? 'bg-gray-800' : 'bg-white'}>4 hours</option>
                <option value={0} className={isDark ? 'bg-gray-800' : 'bg-white'}>Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Active Sessions</h3>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className={`flex items-center justify-between p-4 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      isDark ? 'text-white/60' : 'text-gray-500'
                    }`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                    </svg>
                  </div>
                  <div>
                    <div className={`font-medium flex items-center space-x-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <span>{session.device}</span>
                      {session.current && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Current</span>
                      )}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-white/60' : 'text-gray-600'
                    }`}>
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
      
      {/* Success Modal */}
      <SettingsConfirmationModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        settingType="password"
        autoClose={true}
        autoCloseDelay={3000}
      />
      
      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Password Change Error"
        message={errorMessage}
        type="error"
      />
    </>
  );
}