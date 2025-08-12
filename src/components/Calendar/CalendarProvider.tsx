'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  type: 'task' | 'meeting' | 'reminder' | 'deadline' | 'personal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  attendees: string[]; // Remove the ? to make it required
  location?: string;
  color?: string;
  isAllDay: boolean;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

interface CalendarFilters {
  search: string;
  type: string;
  priority: string;
  status: string;
  view: 'month' | 'week' | 'day' | 'agenda';
  selectedDate: string;
}

interface CalendarContextType {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  filters: CalendarFilters;
  setFilters: (filters: CalendarFilters) => void;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
}

interface CalendarProviderProps {
  children: ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState<CalendarFilters>({
    search: '',
    type: 'all',
    priority: 'all',
    status: 'all',
    view: 'month',
    selectedDate: new Date().toISOString().split('T')[0]
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [];
    setEvents(mockEvents);
  }, []);

  // Filter events based on current filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || event.type === filters.type;
    const matchesPriority = filters.priority === 'all' || event.priority === filters.priority;
    const matchesStatus = filters.status === 'all' || event.status === filters.status;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const addEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEvents(prev => [...prev, newEvent]);
    } catch (err) {
      setError('Failed to create event');
      console.log("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (updatedEvent: CalendarEvent) => {
    setLoading(true);
    setError(null);
    try {
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id 
          ? { ...updatedEvent, updatedAt: new Date().toISOString() }
          : event
      ));
    } catch (err) {
      setError('Failed to update event');
      console.log("Error updating event:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      setError('Failed to delete event');
      console.log("Error deleting event:", err);
    } finally {
      setLoading(false);
    }
  };

  const value: CalendarContextType = {
    events,
    filteredEvents,
    filters,
    setFilters,
    addEvent,
    updateEvent,
    deleteEvent,
    loading,
    error,
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}