'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useCalendarContext } from './CalendarProvider';

export function CalendarStats() {
  const { isDark } = useTheme();
  const { events } = useCalendarContext();

  const today = new Date().toISOString().split('T')[0];
  const thisWeek = new Date();
  const weekStart = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()));
  const weekEnd = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay() + 6));

  const todayEvents = events.filter(event => event.startDate === today);
  const thisWeekEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate > new Date() && event.status === 'scheduled';
  });
  const completedEvents = events.filter(event => event.status === 'completed');

  const stats = [
    {
      title: 'Today\'s Events',
      value: todayEvents.length,
      icon: '📅',
      color: 'blue',
      bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      textColor: isDark ? 'text-blue-400' : 'text-blue-600',
      iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
    },
    {
      title: 'This Week',
      value: thisWeekEvents.length,
      icon: '📊',
      color: 'green',
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
      textColor: isDark ? 'text-green-400' : 'text-green-600',
      iconBg: isDark ? 'bg-green-500/20' : 'bg-green-100'
    },
    {
      title: 'Upcoming',
      value: upcomingEvents.length,
      icon: '⏰',
      color: 'yellow',
      bgColor: isDark ? 'bg-yellow-900/20' : 'bg-yellow-50',
      textColor: isDark ? 'text-yellow-400' : 'text-yellow-600',
      iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
    },
    {
      title: 'Completed',
      value: completedEvents.length,
      icon: '✅',
      color: 'purple',
      bgColor: isDark ? 'bg-purple-900/20' : 'bg-purple-50',
      textColor: isDark ? 'text-purple-400' : 'text-purple-600',
      iconBg: isDark ? 'bg-purple-500/20' : 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} ${isDark ? 'border-gray-700' : 'border-gray-200'} border rounded-lg p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                {stat.value}
              </p>
            </div>
            <div className={`${stat.iconBg} p-3 rounded-lg`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}