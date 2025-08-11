'use client';

import React, { useState, useEffect } from 'react';
import { SettingsCard } from './Common/SettingsCard';
import { SettingsSection } from './Common/SettingsSection';
import { SettingsToggle } from './Common/SettingsToggle';
import { useTheme } from '@/context/ThemeContext';

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
  const { isDark } = useTheme(); // Now this will be used!
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

  // Function to detect date format based on user's locale/country
  const detectDateFormatByLocale = (): DateFormat => {
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    
    // Create a test date and format it to detect the pattern
    const testDate = new Date(2023, 11, 25); // December 25, 2023
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const formatted = formatter.format(testDate);
    
    // Analyze the formatted string to determine the pattern
    if (formatted.includes('25/12/2023') || formatted.includes('25.12.2023') || formatted.includes('25-12-2023')) {
      return 'DD/MM/YYYY'; // European format
    } else if (formatted.includes('2023/12/25') || formatted.includes('2023.12.25') || formatted.includes('2023-12-25')) {
      return 'YYYY-MM-DD'; // ISO format (common in Asia)
    } else {
      return 'MM/DD/YYYY'; // US format (default)
    }
  };

  // Function to detect time format based on locale
  const detectTimeFormatByLocale = (): TimeFormat => {
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    
    // Create a test time and format it
    const testDate = new Date();
    testDate.setHours(14, 30, 0); // 2:30 PM
    
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit'
    });
    
    const formatted = formatter.format(testDate);
    
    // Check if it contains AM/PM indicators
    return formatted.toLowerCase().includes('pm') || formatted.toLowerCase().includes('am') ? '12h' : '24h';
  };

  useEffect(() => {
    const saved = localStorage.getItem('preferencesSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    } else {
      // If no saved settings, auto-detect based on locale
      const detectedDateFormat = detectDateFormatByLocale();
      const detectedTimeFormat = detectTimeFormatByLocale();
      
      const autoDetectedSettings: PreferencesSettings = {
        defaultView: 'kanban',
        taskSorting: 'priority',
        autoSave: true,
        autoArchive: false,
        archiveDays: 30,
        dateFormat: detectedDateFormat,
        timeFormat: detectedTimeFormat,
        weekStart: 'monday',
        workingHours: {
          enabled: false,
          start: '09:00',
          end: '17:00',
        },
        notifications: {
          desktop: true,
          email: false,
          sound: true,
        },
      };
      
      setSettings(autoDetectedSettings);
      localStorage.setItem('preferencesSettings', JSON.stringify(autoDetectedSettings));
    }
  }, []); // Keep empty dependency array since we only want this to run once on mount

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
                    : isDark 
                      ? 'border-white/20 bg-white/5 hover:bg-white/10'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{view.icon}</span>
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{view.label}</span>
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
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Default Task Sorting
              </label>
              <select
                value={settings.taskSorting}
                onChange={(e) => updateSetting('taskSorting', e.target.value as TaskSorting)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {sortingOptions.map((option) => (
                  <option key={option.value} value={option.value} className={isDark ? 'bg-gray-800' : 'bg-white'}>
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
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Archive after (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.archiveDays}
                  onChange={(e) => updateSetting('archiveDays', parseInt(e.target.value))}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
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
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-sm font-medium ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Date Format
                </label>
                <button
                  onClick={() => {
                    const detectedFormat = detectDateFormatByLocale();
                    updateSetting('dateFormat', detectedFormat);
                  }}
                  className={`text-xs px-2 py-1 border rounded transition-all duration-200 ${
                    isDark
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/40 hover:border-blue-400/60 text-blue-100'
                      : 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-700'
                  }`}
                >
                  Auto-detect
                </button>
              </div>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value as DateFormat)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {dateFormats.map((format) => (
                  <option key={format.value} value={format.value} className={isDark ? 'bg-gray-800' : 'bg-white'}>
                    {format.label}
                  </option>
                ))}
              </select>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-white/60' : 'text-gray-500'
              }`}>
                Current locale: {navigator.language || 'Unknown'}
              </p>
            </div>

            {/* Time Format */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Time Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSetting('timeFormat', '12h')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.timeFormat === '12h'
                      ? 'border-blue-500 bg-blue-500/20'
                      : isDark
                        ? 'border-white/20 bg-white/5 hover:bg-white/10'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>12 Hour</span>
                </button>
                <button
                  onClick={() => updateSetting('timeFormat', '24h')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.timeFormat === '24h'
                      ? 'border-blue-500 bg-blue-500/20'
                      : isDark
                        ? 'border-white/20 bg-white/5 hover:bg-white/10'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>24 Hour</span>
                </button>
              </div>
            </div>

            {/* Week Start */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Week Starts On
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSetting('weekStart', 'sunday')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.weekStart === 'sunday'
                      ? 'border-blue-500 bg-blue-500/20'
                      : isDark
                        ? 'border-white/20 bg-white/5 hover:bg-white/10'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Sunday</span>
                </button>
                <button
                  onClick={() => updateSetting('weekStart', 'monday')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    settings.weekStart === 'monday'
                      ? 'border-blue-500 bg-blue-500/20'
                      : isDark
                        ? 'border-white/20 bg-white/5 hover:bg-white/10'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Monday</span>
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
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-700'
                  }`}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => updateNestedSetting('workingHours', 'start', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-700'
                  }`}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => updateNestedSetting('workingHours', 'end', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
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