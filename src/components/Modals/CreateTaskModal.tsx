'use client';

import React, { useState } from 'react';
import { Button } from '../Common/UI/Button';
import { Input } from '../Common/UI/Input';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignedTo: string;
  project: string;
  tags: string[];
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
  loading?: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    project: '',
    tags: []
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TaskFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData);
        // Reset form on success
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          assignedTo: '',
          project: '',
          tags: []
        });
        setTagInput('');
        onClose();
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal with no scroll bars */}
      <div className="relative w-full max-w-2xl mx-auto max-h-[90vh] bg-gradient-to-br from-blue-500/90 to-purple-600/90 rounded-xl shadow-2xl border border-white/30 backdrop-blur-md">
        
        {/* Modal Content */}
        <div className="relative z-10 p-6 rounded-xl h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Create New Task</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 min-h-0">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Task Title *
              </label>
              <Input
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleInputChange('title')}
                error={errors.title}
                transparent={true}
                className="bg-white/25 border-white/50 focus:border-white/80 focus:ring-white/60 text-white placeholder-gray-200 text-base h-10"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description *
              </label>
              <textarea
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleInputChange('description')}
                rows={3}
                className={`w-full px-4 py-3 bg-white/25 border border-white/50 rounded-lg text-white placeholder-gray-200 focus:border-white/80 focus:ring-2 focus:ring-white/60 focus:outline-none transition-all resize-none text-base ${
                  errors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-300">{errors.description}</p>
              )}
            </div>

            {/* Priority and Due Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={handleInputChange('priority')}
                  className="w-full px-4 py-3 bg-white/25 border border-white/50 rounded-lg text-white focus:border-white/80 focus:ring-2 focus:ring-white/60 focus:outline-none transition-all text-base h-10"
                >
                  <option value="low" className="bg-purple-800 text-white">🟢 Low</option>
                  <option value="medium" className="bg-purple-800 text-white">🟡 Medium</option>
                  <option value="high" className="bg-purple-800 text-white">🟠 High</option>
                  <option value="urgent" className="bg-purple-800 text-white">🔴 Urgent</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange('dueDate')}
                  transparent={true}
                  className="bg-white/25 border-white/50 focus:border-white/80 focus:ring-white/60 text-white text-base h-10"
                />
              </div>
            </div>

            {/* Assigned To and Project Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Assigned To
                </label>
                <Input
                  type="text"
                  placeholder="Enter assignee email"
                  value={formData.assignedTo}
                  onChange={handleInputChange('assignedTo')}
                  transparent={true}
                  className="bg-white/25 border-white/50 focus:border-white/80 focus:ring-white/60 text-white placeholder-gray-200 text-base h-10"
                />
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Project
                </label>
                <Input
                  type="text"
                  placeholder="Enter project name"
                  value={formData.project}
                  onChange={handleInputChange('project')}
                  transparent={true}
                  className="bg-white/25 border-white/50 focus:border-white/80 focus:ring-white/60 text-white placeholder-gray-200 text-base h-10"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tags
              </label>
              <div className="flex gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  transparent={true}
                  className="flex-1 bg-white/25 border-white/50 focus:border-white/80 focus:ring-white/60 text-white placeholder-gray-200 text-base h-10"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-white/30 hover:bg-white/40 border border-white/60 text-white text-sm font-medium h-10"
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-500/30 text-blue-100 rounded-full text-sm border border-blue-400/40"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-200 hover:text-blue-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 flex-shrink-0">
              <Button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-white/30 hover:bg-white/40 border border-white/60 text-white text-sm font-medium h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 text-white text-sm font-medium h-10"
              >
                Create Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};