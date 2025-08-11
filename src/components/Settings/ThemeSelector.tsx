'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SettingsCard } from './Common/SettingsCard';
import { SettingsSection } from './Common/SettingsSection';
import { Button } from '@/components/Common/UI/Button';

type Theme = 'light' | 'dark' | 'system';
type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';
type FontSize = 'small' | 'medium' | 'large';

export function ThemeSelector() {
  const { 
    settings, 
    updateTheme, 
    updateAccentColor, 
    updateFontSize, 
    updateAnimations 
  } = useTheme();

  const accentColors = [
    { name: 'blue', color: 'bg-blue-500', label: 'Blue' },
    { name: 'purple', color: 'bg-purple-500', label: 'Purple' },
    { name: 'green', color: 'bg-green-500', label: 'Green' },
    { name: 'orange', color: 'bg-orange-500', label: 'Orange' },
    { name: 'pink', color: 'bg-pink-500', label: 'Pink' },
  ];

  const handleSaveChanges = () => {
    // Changes are automatically saved when made, but we can add a success notification here
    alert('Theme settings saved successfully!');
  };

  return (
    <SettingsCard
      title="Appearance"
      description="Customize how the application looks and feels"
    >
      <div className="space-y-6">
        {/* Theme Selection */}
        <SettingsSection
          title="Theme"
          description="Choose your preferred color scheme"
        >
          <div className="grid grid-cols-3 gap-4">
            {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => updateTheme(themeOption)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  settings.theme === themeOption
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-8 rounded-md ${
                    themeOption === 'light' ? 'bg-white border border-gray-300' :
                    themeOption === 'dark' ? 'bg-gray-900 border border-gray-600' :
                    'bg-gradient-to-r from-white to-gray-900 border border-gray-400'
                  }`} />
                  <span className="text-white font-medium capitalize">{themeOption}</span>
                </div>
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* Accent Color */}
        <SettingsSection
          title="Accent Color"
          description="Choose your preferred accent color"
        >
          <div className="flex space-x-3">
            {accentColors.map((color) => (
              <button
                key={color.name}
                onClick={() => updateAccentColor(color.name as AccentColor)}
                className={`w-12 h-12 rounded-full ${color.color} border-4 transition-all duration-200 ${
                  settings.accentColor === color.name ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                }`}
                title={color.label}
              />
            ))}
          </div>
        </SettingsSection>

        {/* Font Size */}
        <SettingsSection
          title="Font Size"
          description="Adjust the text size throughout the application"
        >
          <div className="grid grid-cols-3 gap-4">
            {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
              <button
                key={size}
                onClick={() => updateFontSize(size)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  settings.fontSize === size
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-white">
                  <div className={`font-medium ${
                    size === 'small' ? 'text-sm' :
                    size === 'medium' ? 'text-base' :
                    'text-lg'
                  }`}>
                    Aa
                  </div>
                  <div className="text-xs text-white/60 mt-1 capitalize">{size}</div>
                </div>
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* Animations */}
        <SettingsSection
          title="Animations"
          description="Control motion and transitions"
        >
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => updateAnimations(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-white">Enable animations and transitions</span>
          </label>
        </SettingsSection>

        {/* Save Button */}
        <div className="pt-6 border-t border-white/20">
          <Button 
            onClick={handleSaveChanges}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </SettingsCard>
  );
}