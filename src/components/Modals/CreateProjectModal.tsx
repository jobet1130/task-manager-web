'use client';

import React, { useState } from 'react';
import { Button } from '../Common/UI/Button';
import { Input } from '../Common/UI/Input';

interface ProjectFormData {
  name: string;
  description: string;
  visibility: 'private' | 'team' | 'public';
  template: 'blank' | 'kanban' | 'scrum' | 'personal';
  color: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => Promise<void>;
  loading?: boolean;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    visibility: 'private',
    template: 'blank',
    color: '#3B82F6'
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        name: '',
        description: '',
        visibility: 'private',
        template: 'blank',
        color: '#3B82F6'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const projectColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const templates = [
    { value: 'blank', label: '📄 Blank Project', description: 'Start from scratch' },
    { value: 'kanban', label: '📋 Kanban Board', description: 'Visual task management' },
    { value: 'scrum', label: '🏃 Scrum', description: 'Agile development' },
    { value: 'personal', label: '👤 Personal', description: 'Individual tasks' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal with consistent styling */}
      <div className="relative w-full max-w-2xl mx-auto max-h-[95vh] bg-gradient-to-br from-green-500/60 to-blue-600/60 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md">
        
        {/* Modal Content */}
        <div className="relative z-10 p-6 rounded-xl h-full flex flex-col max-h-[95vh]">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-white drop-shadow-lg">Create New Project</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Scrollable Form Content */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Project Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={errors.name}
                  transparent={true}
                  className="bg-white/15 border-white/40 focus:border-white/60 focus:ring-white/40 text-white placeholder-white/60 text-base py-3 px-4 h-10"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe your project"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/15 border border-white/40 rounded-lg text-white placeholder-white/60 focus:border-white/60 focus:ring-2 focus:ring-white/40 focus:outline-none transition-all resize-none text-base ${
                    errors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-400/40' : ''
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                )}
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Project Template
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <label
                      key={template.value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.template === template.value
                          ? 'border-white/60 bg-white/20'
                          : 'border-white/40 bg-white/10 hover:bg-white/15'
                      }`}
                    >
                      <input
                        type="radio"
                        name="template"
                        value={template.value}
                        checked={formData.template === template.value}
                        onChange={handleInputChange('template')}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{template.label}</div>
                        <div className="text-gray-300 text-xs">{template.description}</div>
                      </div>
                      {formData.template === template.value && (
                        <div className="text-green-400">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Visibility and Color Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={handleInputChange('visibility')}
                    className="w-full px-4 py-3 bg-white/15 border border-white/40 rounded-lg text-white focus:border-white/60 focus:ring-2 focus:ring-white/40 focus:outline-none transition-all text-base h-10"
                  >
                    <option value="private" className="bg-blue-900/80">🔒 Private</option>
                    <option value="team" className="bg-blue-900/80">👥 Team</option>
                    <option value="public" className="bg-blue-900/80">🌍 Public</option>
                  </select>
                </div>

                {/* Project Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Project Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {projectColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          formData.color === color
                            ? 'border-white scale-110'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          {/* Actions - Fixed at bottom */}
          <div className="flex justify-end space-x-4 pt-4 mt-4 border-t border-white/20 flex-shrink-0">
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/50 text-white transition-all duration-200 rounded-lg text-sm h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="px-6 py-2 bg-gradient-to-r from-green-500/70 to-blue-600/70 hover:from-green-500/80 hover:to-blue-600/80 border-0 text-white transition-all duration-200 rounded-lg shadow-lg text-sm h-10"
            >
              Create Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};