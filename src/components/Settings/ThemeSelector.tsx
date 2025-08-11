'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SettingsCard } from './Common/SettingsCard';
import { SettingsSection } from './Common/SettingsSection';
import { Button } from '@/components/Common/UI/Button';
import { SettingsConfirmationModal } from '@/components/Modals/SettingsConfirmationModal';

type Theme = 'light' | 'dark' | 'system';
type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';
type FontSize = 'small' | 'medium' | 'large';

interface TempSettings {
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
  animations: boolean;
}

export function ThemeSelector() {
  const { 
    settings, 
    updateTheme, 
    updateAccentColor, 
    updateFontSize, 
    updateAnimations,
    isDark
  } = useTheme();

  // Temporary settings state - only applied when save is clicked
  const [tempSettings, setTempSettings] = useState<TempSettings>({
    theme: settings.theme,
    accentColor: settings.accentColor,
    fontSize: settings.fontSize,
    animations: settings.animations,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const accentColors = [
    { name: 'blue', color: 'bg-blue-500', label: 'Blue' },
    { name: 'purple', color: 'bg-purple-500', label: 'Purple' },
    { name: 'green', color: 'bg-green-500', label: 'Green' },
    { name: 'orange', color: 'bg-orange-500', label: 'Orange' },
    { name: 'pink', color: 'bg-pink-500', label: 'Pink' },
  ];

  // Check if there are unsaved changes
  const checkForChanges = (newTempSettings: TempSettings) => {
    const hasChanges = 
      newTempSettings.theme !== settings.theme ||
      newTempSettings.accentColor !== settings.accentColor ||
      newTempSettings.fontSize !== settings.fontSize ||
      newTempSettings.animations !== settings.animations;
    setHasChanges(hasChanges);
  };

  const handleThemeChange = (theme: Theme) => {
    const newTempSettings = { ...tempSettings, theme };
    setTempSettings(newTempSettings);
    checkForChanges(newTempSettings);
  };

  const handleAccentColorChange = (color: AccentColor) => {
    const newTempSettings = { ...tempSettings, accentColor: color };
    setTempSettings(newTempSettings);
    checkForChanges(newTempSettings);
  };

  const handleFontSizeChange = (size: FontSize) => {
    const newTempSettings = { ...tempSettings, fontSize: size };
    setTempSettings(newTempSettings);
    checkForChanges(newTempSettings);
  };

  const handleAnimationsChange = (enabled: boolean) => {
    const newTempSettings = { ...tempSettings, animations: enabled };
    setTempSettings(newTempSettings);
    checkForChanges(newTempSettings);
  };

  const handleSaveChanges = () => {
    // Apply all changes at once
    updateTheme(tempSettings.theme);
    updateAccentColor(tempSettings.accentColor);
    updateFontSize(tempSettings.fontSize);
    updateAnimations(tempSettings.animations);
    
    setHasChanges(false);
    setShowConfirmation(true);
  };

  const handleDiscardChanges = () => {
    // Reset temporary settings to current saved settings
    setTempSettings({
      theme: settings.theme,
      accentColor: settings.accentColor,
      fontSize: settings.fontSize,
      animations: settings.animations,
    });
    setHasChanges(false);
  };

  return (
    <>
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
                  onClick={() => handleThemeChange(themeOption)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    tempSettings.theme === themeOption
                      ? 'border-blue-500 bg-blue-500/20'
                      : isDark
                        ? 'border-white/20 bg-white/5 hover:bg-white/10'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-8 rounded-md ${
                      themeOption === 'light' ? 'bg-white border border-gray-300' :
                      themeOption === 'dark' ? 'bg-gray-900 border border-gray-600' :
                      'bg-gradient-to-r from-white to-gray-900 border border-gray-400'
                    }`} />
                    <span className={`font-medium capitalize ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{themeOption}</span>
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
                  onClick={() => handleAccentColorChange(color.name as AccentColor)}
                  className={`w-12 h-12 rounded-full ${color.color} border-4 transition-all duration-200 ${
                    tempSettings.accentColor === color.name 
                      ? isDark ? 'border-white scale-110' : 'border-gray-900 scale-110'
                      : isDark ? 'border-white/30 hover:border-white/60' : 'border-gray-300 hover:border-gray-600'
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
                  onClick={() => handleFontSizeChange(size)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    tempSettings.fontSize === size
                      ? 'border-blue-500 bg-blue-500/20'
                      : isDark
                        ? 'border-white/20 bg-white/5 hover:bg-white/10'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={isDark ? 'text-white' : 'text-gray-900'}>
                    <div className={`font-medium ${
                      size === 'small' ? 'text-sm' :
                      size === 'medium' ? 'text-base' :
                      'text-lg'
                    }`}>
                      Aa
                    </div>
                    <div className={`text-xs mt-1 capitalize ${
                      isDark ? 'text-white/60' : 'text-gray-600'
                    }`}>{size}</div>
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
                checked={tempSettings.animations}
                onChange={(e) => handleAnimationsChange(e.target.checked)}
                className={`w-5 h-5 rounded focus:ring-blue-500 ${
                  isDark 
                    ? 'border-white/20 bg-white/10 text-blue-500'
                    : 'border-gray-300 bg-white text-blue-600'
                }`}
              />
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                Enable animations and transitions
              </span>
            </label>
          </SettingsSection>

          {/* Unsaved Changes Warning */}
          {hasChanges && (
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">You have unsaved changes</span>
              </div>
              <p className="text-sm mt-1">Click &ldquo;Save Changes&rdquo; to apply your settings or &ldquo;Discard&rdquo; to cancel.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`pt-6 border-t ${
            isDark ? 'border-white/20' : 'border-gray-200'
          }`}>
            <div className="flex space-x-3">
              <Button 
                onClick={handleSaveChanges}
                disabled={!hasChanges}
                className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 ${
                  !hasChanges ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Save Changes
              </Button>
              {hasChanges && (
                <Button 
                  onClick={handleDiscardChanges}
                  className={`border-2 ${
                    isDark 
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Discard
                </Button>
              )}
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Confirmation Modal */}
      <SettingsConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        settingType="general"
      />
    </>
  );
}