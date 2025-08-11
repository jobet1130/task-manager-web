'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';
type FontSize = 'small' | 'medium' | 'large';

interface ThemeSettings {
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
  animations: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateTheme: (theme: Theme, onSuccess?: (type: string) => void) => void;
  updateAccentColor: (color: AccentColor, onSuccess?: (type: string) => void) => void;
  updateFontSize: (size: FontSize, onSuccess?: (type: string) => void) => void;
  updateAnimations: (enabled: boolean, onSuccess?: (type: string) => void) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [settings, setSettings] = useState<ThemeSettings>({
    theme: 'dark',
    accentColor: 'blue',
    fontSize: 'medium',
    animations: true,
  });

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
    const savedAccentColor = localStorage.getItem('accentColor') as AccentColor || 'blue';
    const savedFontSize = localStorage.getItem('fontSize') as FontSize || 'medium';
    const savedAnimations = localStorage.getItem('animations') === 'true';

    setSettings({
      theme: savedTheme,
      accentColor: savedAccentColor,
      fontSize: savedFontSize,
      animations: savedAnimations,
    });

    // Apply all settings immediately
    applyTheme(savedTheme);
    applyAccentColor(savedAccentColor);
    applyFontSize(savedFontSize);
    applyAnimations(savedAnimations);
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      root.classList.toggle('dark', prefersDark);
    } else {
      const isDarkTheme = theme === 'dark';
      setIsDark(isDarkTheme);
      root.classList.toggle('dark', isDarkTheme);
    }
  };

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch (size) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'medium':
        root.classList.add('text-base');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
    }
  };

  const applyAccentColor = (color: AccentColor) => {
    const root = document.documentElement;
    
    // Remove existing accent color classes
    root.classList.remove(
      'accent-blue', 'accent-purple', 'accent-green', 
      'accent-orange', 'accent-pink'
    );
    
    // Add new accent color class
    root.classList.add(`accent-${color}`);
    
    // Set CSS custom properties for dynamic theming
    const colorMap = {
      blue: { primary: '59 130 246', secondary: '147 197 253' },
      purple: { primary: '147 51 234', secondary: '196 181 253' },
      green: { primary: '34 197 94', secondary: '134 239 172' },
      orange: { primary: '249 115 22', secondary: '251 191 36' },
      pink: { primary: '236 72 153', secondary: '244 114 182' },
    };
    
    const colors = colorMap[color];
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
  };

  const applyAnimations = (enabled: boolean) => {
    const root = document.documentElement;
    root.classList.toggle('no-animations', !enabled);
  };

  const updateTheme = (theme: Theme, onSuccess?: (type: string) => void) => {
    setSettings(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    onSuccess?.('theme');
  };

  const updateAccentColor = (accentColor: AccentColor, onSuccess?: (type: string) => void) => {
    setSettings(prev => ({ ...prev, accentColor }));
    localStorage.setItem('accentColor', accentColor);
    applyAccentColor(accentColor);
    onSuccess?.('accentColor');
  };

  const updateFontSize = (fontSize: FontSize, onSuccess?: (type: string) => void) => {
    setSettings(prev => ({ ...prev, fontSize }));
    localStorage.setItem('fontSize', fontSize);
    applyFontSize(fontSize);
    onSuccess?.('fontSize');
  };

  const updateAnimations = (animations: boolean, onSuccess?: (type: string) => void) => {
    setSettings(prev => ({ ...prev, animations }));
    localStorage.setItem('animations', animations.toString());
    applyAnimations(animations);
    onSuccess?.('animations');
  };

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const value: ThemeContextType = {
    settings,
    updateTheme,
    updateAccentColor,
    updateFontSize,
    updateAnimations,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}