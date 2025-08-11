'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../Common/UI/Button';
import { Input } from '../Common/UI/Input';
import { CalendarEvent } from '../Calendar/CalendarProvider';

// Remove 'status' from the Omit type since addEvent expects it
type EventFormData = Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>;

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: EventFormData) => Promise<void>;
  loading?: boolean;
  initialData?: CalendarEvent | null;
  isEditMode?: boolean;
  onDelete?: () => Promise<void>;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  isEditMode = false,
  onDelete
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    type: 'meeting',
    priority: 'medium',
    status: 'scheduled',
    location: '',
    attendees: [],
    isAllDay: false,
    recurrence: 'none'
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [attendeeInput, setAttendeeInput] = useState('');

  // Move useEffect BEFORE the early return to fix React hooks rule
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        type: initialData.type,
        priority: initialData.priority,
        status: initialData.status,
        location: initialData.location || '',
        attendees: initialData.attendees,
        isAllDay: initialData.isAllDay,
        recurrence: initialData.recurrence || 'none'
      });
      setAttendeeInput('');
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        type: 'meeting',
        priority: 'medium',
        status: 'scheduled',
        location: '',
        attendees: [],
        isAllDay: false,
        recurrence: 'none'
      });
      setAttendeeInput('');
    }
  }, [isEditMode, initialData]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        type: 'meeting',
        priority: 'medium',
        status: 'scheduled',
        location: '',
        attendees: [],
        isAllDay: false,
        recurrence: 'none'
      });
      setAttendeeInput('');
      onClose();
    }
  };

  const handleInputChange = (field: keyof EventFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = field === 'isAllDay' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddAttendee = () => {
    if (attendeeInput.trim() && !formData.attendees.includes(attendeeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, attendeeInput.trim()]
      }));
      setAttendeeInput('');
    }
  };

  const handleRemoveAttendee = (attendeeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee !== attendeeToRemove)
    }));
  };

  // Remove this entire duplicate useEffect block (lines 166-204)
  // useEffect(() => {
  //   if (isEditMode && initialData) {
  //     setFormData({
  //       title: initialData.title,
  //       description: initialData.description || '',
  //       startDate: initialData.startDate,
  //       endDate: initialData.endDate,
  //       startTime: initialData.startTime || '',
  //       endTime: initialData.endTime || '',
  //       type: initialData.type,
  //       priority: initialData.priority,
  //       status: initialData.status,
  //       location: initialData.location || '',
  //       attendees: initialData.attendees,
  //       isAllDay: initialData.isAllDay,
  //       recurrence: initialData.recurrence || 'none'
  //     });
  //     setAttendeeInput('');
  //   } else if (!isEditMode) {
  //     // Reset form for create mode
  //     setFormData({
  //       title: '',
  //       description: '',
  //       startDate: '',
  //       endDate: '',
  //       startTime: '',
  //       endTime: '',
  //       type: 'meeting',
  //       priority: 'medium',
  //       status: 'scheduled',
  //       location: '',
  //       attendees: [],
  //       isAllDay: false,
  //       recurrence: 'none'
  //     });
  //     setAttendeeInput('');
  //   }
  // }, [isEditMode, initialData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Background Design */}
        <div className="absolute inset-0 -z-10">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl" />
          
          {/* Animated gradient orbs */}
          <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-r from-blue-400/30 to-cyan-500/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Modal Content */}
        <div className="relative z-10 bg-transparent p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {isEditMode ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Event Title *
              </label>
              <Input
                type="text"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleInputChange('title')}
                transparent={true}
                className="bg-white/5 border-white/20 focus:border-white/40 focus:ring-white/20"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter event description"
                value={formData.description}
                onChange={handleInputChange('description')}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all backdrop-blur-sm resize-none"
              />
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isAllDay"
                checked={formData.isAllDay}
                onChange={handleInputChange('isAllDay')}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="isAllDay" className="text-sm font-medium text-gray-200">
                All Day Event
              </label>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange('startDate')}
                  transparent={true}
                  className="bg-white/5 border-white/20 focus:border-white/40 focus:ring-white/20"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  End Date *
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange('endDate')}
                  transparent={true}
                  className="bg-white/5 border-white/20 focus:border-white/40 focus:ring-white/20"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Time Row - Only show if not all day */}
            {!formData.isAllDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange('startTime')}
                    transparent={true}
                    className="bg-white/5 border-white/20 focus:border-white/40 focus:ring-white/20"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange('endTime')}
                    transparent={true}
                    className="bg-white/5 border-white/20 focus:border-white/40 focus:ring-white/20"
                  />
                </div>
              </div>
            )}

            {/* Type and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.type}
                  onChange={handleInputChange('type')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all backdrop-blur-sm"
                >
                  <option value="task" className="bg-gray-800">📋 Task</option>
                  <option value="meeting" className="bg-gray-800">🤝 Meeting</option>
                  <option value="reminder" className="bg-gray-800">⏰ Reminder</option>
                  <option value="deadline" className="bg-gray-800">⚡ Deadline</option>
                  <option value="personal" className="bg-gray-800">👤 Personal</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={handleInputChange('priority')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all backdrop-blur-sm"
                >
                  <option value="low" className="bg-gray-800">🟢 Low</option>
                  <option value="medium" className="bg-gray-800">🟡 Medium</option>
                  <option value="high" className="bg-gray-800">🟠 High</option>
                  <option value="urgent" className="bg-gray-800">🔴 Urgent</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Location
              </label>
              <Input
                type="text"
                placeholder="Enter event location"
                value={formData.location}
                onChange={handleInputChange('location')}
                transparent={true}
                className="bg-white/5 border-white/20 focus:border-white/40 focus:ring-white/20"
              />
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Attendees
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="email"
                  placeholder="Add attendee email"
                  value={attendeeInput}
                  onChange={(e) => setAttendeeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttendee())}
                  transparent={true}
                  className="flex-1 bg-white/5 border-white/20 focus:border-white/40 focus:ring-white/20"
                />
                <Button
                  type="button"
                  onClick={handleAddAttendee}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                >
                  Add
                </Button>
              </div>
              {formData.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.attendees.map((attendee, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm border border-purple-400/30"
                    >
                      {attendee}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendee(attendee)}
                        className="ml-2 text-purple-300 hover:text-purple-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Recurrence */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Recurrence
              </label>
              <select
                value={formData.recurrence}
                onChange={handleInputChange('recurrence')}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all backdrop-blur-sm"
              >
                <option value="none" className="bg-gray-800">No Repeat</option>
                <option value="daily" className="bg-gray-800">Daily</option>
                <option value="weekly" className="bg-gray-800">Weekly</option>
                <option value="monthly" className="bg-gray-800">Monthly</option>
                <option value="yearly" className="bg-gray-800">Yearly</option>
              </select>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              {isEditMode && onDelete && (
                <Button
                  type="button"
                  onClick={onDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 border-0 text-white"
                >
                  Delete Event
                </Button>
              )}
              <Button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 border-0 text-white"
              >
                {isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};