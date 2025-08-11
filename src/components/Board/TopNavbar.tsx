'use client';

import React from 'react';
import { Button } from '@/components/Common/UI/Button';

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          ☰
        </Button>
        
        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">🔔</span>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
}