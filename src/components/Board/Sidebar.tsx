'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: '✅' },
  { name: 'Projects', href: '/dashboard/projects', icon: '📁' },
  { name: 'Calendar', href: '/dashboard/calendar', icon: '📅' },
  { name: 'Team', href: '/dashboard/team', icon: '👥' },
  { name: 'Reports', href: '/dashboard/reports', icon: '📈' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isDark } = useTheme();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className={`flex min-h-0 flex-1 flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>TaskFlow</h1>
            </div>
            
            {/* Navigation */}
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? `${isDark ? 'bg-gray-700 text-primary' : 'bg-secondary text-primary'} border-r-2 border-primary`
                        : `${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                    )}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User section */}
          <div className={`flex flex-shrink-0 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-t p-4`}>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>User Name</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className={cn(
        `fixed inset-y-0 left-0 z-50 w-64 ${isDark ? 'bg-gray-800' : 'bg-white'} transform transition-transform duration-300 ease-in-out lg:hidden`,
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className={`flex min-h-0 flex-1 flex-col ${isDark ? 'border-gray-700' : 'border-gray-200'} border-r`}>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* Mobile header */}
            <div className="flex items-center justify-between px-4">
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>TaskFlow</h1>
              <button
                onClick={onClose}
                className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ✕
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? `${isDark ? 'bg-gray-700 text-primary' : 'bg-secondary text-primary'}`
                        : `${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                    )}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}