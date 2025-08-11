'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Common/UI/Button';

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

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

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

  const savePreferences = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  };

  const notificationTypes = [
    { key: 'taskAssigned', label: 'Task Assigned', description: 'When a task is assigned to you' },
    { key: 'taskCompleted', label: 'Task Completed', description: 'When a task you created is completed' },
    { key: 'projectUpdates', label: 'Project Updates', description: 'Important project announcements' },
    { key: 'teamInvites', label: 'Team Invites', description: 'When you\'re invited to join a team' },
    { key: 'systemUpdates', label: 'System Updates', description: 'System maintenance and updates' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
        <p className="text-white/60">Manage how and when you receive notifications</p>
      </div>

      {/* Email Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
        <div className="space-y-3">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">{type.label}</div>
                <div className="text-white/60 text-sm">{type.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.email[type.key as keyof typeof preferences.email]}
                  onChange={(e) => updatePreference('email', type.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
        <div className="space-y-3">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">{type.label}</div>
                <div className="text-white/60 text-sm">{type.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.push[type.key as keyof typeof preferences.push]}
                  onChange={(e) => updatePreference('push', type.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Quiet Hours</h3>
        <div className="p-4 bg-white/5 rounded-lg space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.quietHours.enabled}
              onChange={(e) => updatePreference('quietHours', 'enabled', e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-white">Enable quiet hours</span>
          </label>
          
          {preferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Start Time</label>
                <input
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) => updatePreference('quietHours', 'start', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">End Time</label>
                <input
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) => updatePreference('quietHours', 'end', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sound Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Sound</h3>
        <div className="p-4 bg-white/5 rounded-lg space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.sound.enabled}
              onChange={(e) => updatePreference('sound', 'enabled', e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-white">Enable notification sounds</span>
          </label>
          
          {preferences.sound.enabled && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Volume: {preferences.sound.volume}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.sound.volume}
                onChange={(e) => updatePreference('sound', 'volume', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t border-white/20">
        <Button 
          onClick={savePreferences}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
        >
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
}