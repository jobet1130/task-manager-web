'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Common/UI/Button';
import { CreateEventModal } from '@/components/Modals/CreateEventModal';
import { useTheme } from '@/context/ThemeContext';
import { useCalendarContext, CalendarEvent } from './CalendarProvider';

export function CalendarHeader() {
  const { isDark } = useTheme();
  const { events, currentDate, setCurrentDate, filters, setFilters, addEvent } = useCalendarContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const formatCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (filters.view) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      default:
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Update the type to match what addEvent expects
  const handleCreateEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addEvent(eventData);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Calendar
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your schedule and events efficiently
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {events.length} {events.length === 1 ? 'event' : 'events'} total
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Event
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigateDate('prev')}
              variant="outline"
              size="sm"
              className={`p-2 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            
            <Button
              onClick={goToToday}
              variant="outline"
              size="sm"
              className={`px-3 py-2 ${isDark ? 'bg-blue-700 border-blue-600 text-blue-300 hover:bg-blue-600' : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'}`}
            >
              Today
            </Button>
            
            <Button
              onClick={() => navigateDate('next')}
              variant="outline"
              size="sm"
              className={`p-2 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
          
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrentDate()}
          </h2>
        </div>

        {/* View Toggle */}
        <div className="flex border rounded-lg overflow-hidden">
          {['month', 'week', 'day', 'agenda'].map((view) => (
            <button
              key={view}
              onClick={() => setFilters({ ...filters, view: view as 'month' | 'week' | 'day' | 'agenda' })}
              className={`px-3 py-2 text-sm capitalize ${
                filters.view === view
                  ? 'bg-blue-600 text-white'
                  : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
      
      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </>
  );
}