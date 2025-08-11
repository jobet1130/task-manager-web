'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Common/UI/Button';
import { useTheme } from '@/context/ThemeContext';
import { TestSoundButton } from './Common/TestSoundButton';
import { SettingsConfirmationModal } from '@/components/Modals/SettingsConfirmationModal';

interface NotificationPreferences {
  email: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    projectUpdates: boolean;
    teamInvites: boolean;
    systemUpdates: boolean;
  };
  push: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    projectUpdates: boolean;
    teamInvites: boolean;
    systemUpdates: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  sound: {
    enabled: boolean;
    volume: number;
  };
}

export function NotificationSettings() {
  const { isDark } = useTheme();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      taskAssigned: true,
      taskCompleted: true,
      projectUpdates: true,
      teamInvites: true,
      systemUpdates: false,
    },
    push: {
      taskAssigned: true,
      taskCompleted: false,
      projectUpdates: true,
      teamInvites: true,
      systemUpdates: false,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    sound: {
      enabled: true,
      volume: 50,
    },
  });

  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [isTestingSound, setIsTestingSound] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }

    // Check current notification permission
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  // Auto-save preferences when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
      setLastSaved(new Date());
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(timeoutId);
  }, [preferences]);

  const updatePreference = (
    category: keyof NotificationPreferences,
    key: string,
    value: boolean | string | number
  ) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPushPermission(permission);
        
        if (permission === 'granted') {
          // Send a test notification
          new Notification('Notifications Enabled!', {
            body: 'You will now receive push notifications from TaskFlow.',
            icon: '/favicon.ico',
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const sendTestNotification = () => {
    if (pushPermission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from TaskFlow. Your notifications are working!',
        icon: '/favicon.ico',
        tag: 'test-notification',
      });
    } else {
      alert('Please enable push notifications first.');
    }
  };

  const testNotificationSound = () => {
    if (!preferences.sound.enabled) return;
    
    setIsTestingSound(true);
    
    // Create audio context and play a notification sound
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(preferences.sound.volume / 100 * 0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    setTimeout(() => setIsTestingSound(false), 300);
  };

  const isInQuietHours = () => {
    if (!preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = preferences.quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  };

  const savePreferences = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    setLastSaved(new Date());
    
    // Show the save confirmation modal
    setShowSaveModal(true);
    
    // Show success message
    if ('Notification' in window && pushPermission === 'granted') {
      new Notification('Settings Saved', {
        body: 'Your notification preferences have been saved successfully.',
        icon: '/favicon.ico',
      });
    }
  };

  const getPermissionStatusColor = () => {
    switch (pushPermission) {
      case 'granted': return 'text-green-400';
      case 'denied': return 'text-red-400';
      default: return isDark ? 'text-yellow-400' : 'text-yellow-600';
    }
  };

  const getPermissionStatusText = () => {
    switch (pushPermission) {
      case 'granted': return 'Enabled';
      case 'denied': return 'Blocked';
      default: return 'Not Set';
    }
  };

  const notificationTypes = [
    { key: 'taskAssigned', label: 'Task Assigned', description: 'When a task is assigned to you' },
    { key: 'taskCompleted', label: 'Task Completed', description: 'When a task you created is completed' },
    { key: 'projectUpdates', label: 'Project Updates', description: 'Important project announcements' },
    { key: 'teamInvites', label: 'Team Invites', description: 'When you\'re invited to join a team' },
    { key: 'systemUpdates', label: 'System Updates', description: 'System maintenance and updates' },
  ];

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Notifications</h2>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Manage how and when you receive notifications
          </p>
          {lastSaved && (
            <p className={`text-sm mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Browser Push Notifications */}
        <div className={`p-4 rounded-lg border ${
          isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Browser Push Notifications</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Status: <span className={getPermissionStatusColor()}>{getPermissionStatusText()}</span>
                {isInQuietHours() && (
                  <span className={`ml-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    (Currently in quiet hours)
                  </span>
                )}
              </p>
            </div>
            <div className="flex space-x-2">
              {pushPermission !== 'granted' && (
                <Button
                  onClick={requestNotificationPermission}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Enable
                </Button>
              )}
              {pushPermission === 'granted' && (
                <Button
                  onClick={sendTestNotification}
                  size="sm"
                  variant="outline"
                  className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
                >
                  Test
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Email Notifications</h3>
          <div className="space-y-3">
            {notificationTypes.map((type) => (
              <div key={type.key} className={`flex items-center justify-between p-4 rounded-lg ${
                isDark ? 'bg-gray-800/30' : 'bg-gray-50'
              }`}>
                <div>
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{type.label}</div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{type.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.email[type.key as keyof typeof preferences.email]}
                    onChange={(e) => updatePreference('email', type.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                    isDark ? 'bg-white/20' : 'bg-gray-300'
                  }`}></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Push Notifications</h3>
          <div className="space-y-3">
            {notificationTypes.map((type) => (
              <div key={type.key} className={`flex items-center justify-between p-4 rounded-lg ${
                isDark ? 'bg-gray-800/30' : 'bg-gray-50'
              }`}>
                <div>
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{type.label}</div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{type.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.push[type.key as keyof typeof preferences.push]}
                    onChange={(e) => updatePreference('push', type.key, e.target.checked)}
                    className="sr-only peer"
                    disabled={pushPermission !== 'granted'}
                  />
                  <div className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                    pushPermission !== 'granted' 
                      ? 'opacity-50 cursor-not-allowed bg-gray-400' 
                      : isDark ? 'bg-white/20' : 'bg-gray-300'
                  }`}></div>
                </label>
              </div>
            ))}
          </div>
          {pushPermission !== 'granted' && (
            <p className={`text-sm ${
              isDark ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              Enable browser notifications above to configure push notification preferences.
            </p>
          )}
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Quiet Hours</h3>
          <div className={`p-4 rounded-lg space-y-4 ${
            isDark ? 'bg-gray-800/30' : 'bg-gray-50'
          }`}>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.quietHours.enabled}
                onChange={(e) => updatePreference('quietHours', 'enabled', e.target.checked)}
                className={`w-5 h-5 rounded text-blue-500 focus:ring-blue-500 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 checked:bg-blue-600' 
                    : 'border-gray-300 bg-white checked:bg-blue-600'
                }`}
              />
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                Enable quiet hours
              </span>
            </label>
            
            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>Start Time</label>
                  <input
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => updatePreference('quietHours', 'start', e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border border-gray-600 text-white' 
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>End Time</label>
                  <input
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => updatePreference('quietHours', 'end', e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border border-gray-600 text-white' 
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sound Settings */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Sound</h3>
          <div className={`p-4 rounded-lg space-y-4 ${
            isDark ? 'bg-gray-800/30' : 'bg-gray-50'
          }`}>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.sound.enabled}
                onChange={(e) => updatePreference('sound', 'enabled', e.target.checked)}
                className={`w-5 h-5 rounded text-blue-500 focus:ring-blue-500 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 checked:bg-blue-600' 
                    : 'border-gray-300 bg-white checked:bg-blue-600'
                }`}
              />
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                Enable notification sounds
              </span>
            </label>
            
            {preferences.sound.enabled && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`block text-sm font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>Volume: {preferences.sound.volume}%</label>
                  <TestSoundButton
                    enabled={preferences.sound.enabled}
                    volume={preferences.sound.volume}
                    isPlaying={isTestingSound}
                    onTestSound={testNotificationSound}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.sound.volume}
                  onChange={(e) => updatePreference('sound', 'volume', parseInt(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className={`pt-6 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <Button 
            onClick={savePreferences}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
          >
            Save Notification Settings
          </Button>
        </div>
      </div>

      {/* Save Confirmation Modal */}
      <SettingsConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        settingType="notifications"
        autoClose={true}
        autoCloseDelay={2500}
      />
    </>
  );
}