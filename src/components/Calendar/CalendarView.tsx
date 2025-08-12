'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useCalendarContext, CalendarEvent } from './CalendarProvider';
import { CreateEventModal } from '@/components/Modals/CreateEventModal';

export function CalendarView() {
  const { isDark } = useTheme();
  const { filteredEvents, filters, currentDate, selectedDate, setSelectedDate, addEvent } = useCalendarContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState<Date | null>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedDateForEvent(date);
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    // If a date was selected, use that date, otherwise use the provided date
    if (selectedDateForEvent) {
      const updatedEventData = {
        ...eventData,
        startDate: selectedDateForEvent.toISOString().split('T')[0],
        endDate: eventData.endDate || selectedDateForEvent.toISOString().split('T')[0]
      };
      await addEvent(updatedEventData);
    } else {
      await addEvent(eventData);
    }
    setSelectedDateForEvent(null);
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dayEvents = filteredEvents.filter(event => 
        event.startDate === current.toISOString().split('T')[0]
      );
      
      days.push({
        date: new Date(current),
        events: dayEvents,
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        isSelected: current.toDateString() === selectedDate.toDateString()
      });
      
      current.setDate(current.getDate() + 1);
    }

    return (
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
        {/* Calendar Header */}
        <div className={`grid grid-cols-7 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={`p-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`min-h-[120px] p-2 border-r border-b cursor-pointer transition-colors ${
                isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              } ${
                day.isSelected ? (isDark ? 'bg-blue-900/30' : 'bg-blue-50') : ''
              } ${
                !day.isCurrentMonth ? (isDark ? 'text-gray-600' : 'text-gray-400') : ''
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                day.isToday ? 'text-blue-600 font-bold' : 
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {day.date.getDate()}
              </div>
              
              <div className="space-y-1">
                {day.events.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate`}
                    style={{ backgroundColor: event.color + '20', color: event.color }}
                  >
                    {event.title}
                  </div>
                ))}
                {day.events.length > 3 && (
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => 
      new Date(a.startDate + ' ' + (a.startTime || '00:00')).getTime() - 
      new Date(b.startDate + ' ' + (b.startTime || '00:00')).getTime()
    );

    return (
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg`}>
        <div className="p-4">
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Upcoming Events
          </h3>
          
          {sortedEvents.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No events found
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEvents.map(event => (
                <div
                  key={event.id}
                  className={`p-4 border rounded-lg ${isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          📅 {new Date(event.startDate).toLocaleDateString()}
                        </span>
                        {!event.isAllDay && event.startTime && (
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            🕐 {event.startTime} - {event.endTime}
                          </span>
                        )}
                        {event.location && (
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            📍 {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        event.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {event.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        {filters.view === 'month' && renderMonthView()}
        {filters.view === 'agenda' && renderAgendaView()}
        {(filters.view === 'week' || filters.view === 'day') && (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-8 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {filters.view.charAt(0).toUpperCase() + filters.view.slice(1)} view coming soon...
            </p>
          </div>
        )}
      </div>
      
      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedDateForEvent(null);
        }}
        onSubmit={handleCreateEvent}
      />
    </>
  );
}