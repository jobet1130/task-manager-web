'use client';

import React, { useState, useEffect } from 'react';
import { SettingsCard } from './Common/SettingsCard';
import { SettingsSection } from './Common/SettingsSection';
import { SettingsToggle } from './Common/SettingsToggle';

type DefaultView = 'kanban' | 'list' | 'calendar' | 'timeline';
type TaskSorting = 'priority' | 'dueDate' | 'created' | 'alphabetical';
type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
type TimeFormat = '12h' | '24h';
type WeekStart = 'sunday' | 'monday';

interface PreferencesSettings {
  defaultView: DefaultView;
  taskSorting: TaskSorting;
  autoSave: boolean;
  autoArchive: boolean;
  archiveDays: number;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  weekStart: WeekStart;
  workingHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  notifications: {
    desktop: boolean;
    email: boolean;
    sound: boolean;
  };
}

export const PreferencesSettings: React.FC = () => {
  const [settings, setSettings] = useState<PreferencesSettings>({
    defaultView: 'kanban',
    taskSorting: 'priority',
    autoSave: true,
    autoArchive: false,
    archiveDays: 30,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    weekStart: 'monday',
    workingHours: {
      enabled: false,
      start: '09:00',
      end: '17:00'
    },
    notifications: {
      desktop: true,
      email: true,
      sound: false
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('preferencesSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSetting = <K extends keyof PreferencesSettings>(
    key: K,
    value: PreferencesSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('preferencesSettings', JSON.stringify(newSettings));
  };

  const updateNestedSetting = <T extends keyof PreferencesSettings>(
    parent: T,
    key: keyof PreferencesSettings[T],
    value: PreferencesSettings[T][keyof PreferencesSettings[T]]
  ) => {
    const newSettings = {
      ...settings,
      [parent]: {
        ...(settings[parent] as object),
        [key]: value
      }
    };
    setSettings(newSettings);
    localStorage.setItem('preferencesSettings', JSON.stringify(newSettings));
  };

  const defaultViews = [
    { value: 'kanban', label: 'Kanban Board', icon: '📋' },
    { value: 'list', label: 'List View', icon: '📝' },
    { value: 'calendar', label: 'Calendar', icon: '📅' },
    { value: 'timeline', label: 'Timeline', icon: '📊' }
  ];

  const sortingOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'created', label: 'Created Date' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
  ];

  return (
    <SettingsCard
      title="Preferences"
      description="Customize your workflow and display preferences"
    >
      <div className="space-y-6">
        {/* Default View */}
        <SettingsSection
          title="Default View"
          description="Choose your preferred project view when opening the app"
        >
          <div className="grid grid-cols-2 gap-3">
            {defaultViews.map((view) => (
              <button
                key={view.value}
                onClick={() => updateSetting('defaultView', view.value as DefaultView)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  settings.defaultView === view.value
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{view.icon}</span>
                  <span className="text-sm font-medium text-white">{view.label}</span>
                </div>
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* Task Management */}
        <SettingsSection
          title="Task Management"
          description="Configure how tasks are handled and displayed"
        >
          <div className="space-y-4">
            {/* Task Sorting */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Default Task Sorting
              </label>
              <select
                value={settings.taskSorting}
                onChange={(e) => updateSetting('taskSorting', e.target.value as TaskSorting)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortingOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto Save */}
            <SettingsToggle
              label="Auto Save"
              description="Automatically save changes as you work"
              checked={settings.autoSave}
              onChange={(checked) => updateSetting('autoSave', checked)}
            />

            {/* Auto Archive */}
            <SettingsToggle
              label="Auto Archive Completed Tasks"
              description="Automatically archive tasks after completion"
              checked={settings.autoArchive}
              onChange={(checked) => updateSetting('autoArchive', checked)}
            />

            {/* Archive Days */}
            {settings.autoArchive && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Archive after (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.archiveDays}
                  onChange={(e) => updateSetting('archiveDays', parseInt(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Date & Time */}
        <SettingsSection
          title="Date & Time"
          description="Configure date and time display formats"
        >
          <div className="space-y-4">
            {/* Date Format */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value as DateFormat)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateFormats.map((format) => (
                  <option key={format.value} value={format.value} className="bg-gray-800">
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Time Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSetting('timeFormat', '12h')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.timeFormat === '12h'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm font-medium text-white">12 Hour</span>
                </button>
                <button
                  onClick={() => updateSetting('timeFormat', '24h')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.timeFormat === '24h'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm font-medium text-white">24 Hour</span>
                </button>
              </div>
            </div>

            {/* Week Start */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Week Starts On
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSetting('weekStart', 'sunday')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.weekStart === 'sunday'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm font-medium text-white">Sunday</span>
                </button>
                <button
                  onClick={() => updateSetting('weekStart', 'monday')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.weekStart === 'monday'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm font-medium text-white">Monday</span>
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Working Hours */}
        <SettingsSection
          title="Working Hours"
          description="Set your working hours for better task scheduling"
        >
          <div className="space-y-4">
            <SettingsToggle
              label="Enable Working Hours"
              description="Use working hours for scheduling and notifications"
              checked={settings.workingHours.enabled}
              onChange={(checked) => updateNestedSetting('workingHours', 'enabled', checked)}
            />

            {settings.workingHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => updateNestedSetting('workingHours', 'start', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => updateNestedSetting('workingHours', 'end', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Quick Notifications */}
        <SettingsSection
          title="Quick Notifications"
          description="Basic notification preferences (detailed settings in Notifications tab)"
        >
          <div className="space-y-3">
            <SettingsToggle
              label="Desktop Notifications"
              description="Show notifications on your desktop"
              checked={settings.notifications.desktop}
              onChange={(checked) => updateNestedSetting('notifications', 'desktop', checked)}
            />
            <SettingsToggle
              label="Email Notifications"
              description="Receive notifications via email"
              checked={settings.notifications.email}
              onChange={(checked) => updateNestedSetting('notifications', 'email', checked)}
            />
            <SettingsToggle
              label="Sound Notifications"
              description="Play sounds for notifications"
              checked={settings.notifications.sound}
              onChange={(checked) => updateNestedSetting('notifications', 'sound', checked)}
            />
          </div>
        </SettingsSection>
      </div>
    </SettingsCard>
  );
};