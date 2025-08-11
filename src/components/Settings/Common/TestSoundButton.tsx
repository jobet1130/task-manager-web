'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface TestSoundButtonProps {
  enabled: boolean;
  volume: number;
  disabled?: boolean;
  className?: string;
  isPlaying?: boolean;  // Changed from isTestingSound to isPlaying
  onTestSound?: () => void;
}

export const TestSoundButton: React.FC<TestSoundButtonProps> = ({
  enabled,
  volume,
  disabled = false,
  className = '',
  isPlaying: parentIsPlaying,  // Renamed parameter
  onTestSound
}) => {
  const { isDark } = useTheme();
  const [internalIsTestingSound, setInternalIsTestingSound] = useState(false);

  // Use parent's playing state if provided, otherwise use internal state
  const isTestingSound = parentIsPlaying !== undefined ? parentIsPlaying : internalIsTestingSound;

  const testNotificationSound = () => {
    if (!enabled) return;
    
    // If parent provides a test function, use it
    if (onTestSound) {
      onTestSound();
      return;
    }
    
    // Otherwise, use internal implementation
    setInternalIsTestingSound(true);
    
    // Create audio context and play a notification sound
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    setTimeout(() => setInternalIsTestingSound(false), 300);
  };

  return (
    <button
      onClick={testNotificationSound}
      disabled={isTestingSound || disabled || !enabled}
      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isDark 
          ? 'border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700 focus:ring-offset-gray-900'
          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-offset-white'
      } ${isTestingSound ? 'opacity-50' : ''} ${className}`}
    >
      {isTestingSound ? 'Playing...' : 'Test Sound'}
    </button>
  );
};