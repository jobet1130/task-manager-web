'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  visibility: 'private' | 'team' | 'public';
  template: 'blank' | 'kanban' | 'scrum' | 'personal';
  color: string;
  status: 'active' | 'completed' | 'on_hold' | 'archived';
  owner?: string;
  members?: string[];
  progress?: number;
  tasksCount?: number;
  completedTasks?: number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

interface ProjectFilters {
  search: string;
  status: string;
  visibility: string;
  template: string;
  sortBy: string;
  view: 'list' | 'grid';
}

interface ProjectContextType {
  projects: Project[];
  filteredProjects: Project[];
  filters: ProjectFilters;
  setFilters: (filters: ProjectFilters) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}

interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    status: 'all',
    visibility: 'all',
    template: 'all',
    sortBy: 'updatedAt',
    view: 'grid'
  });

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           (project.description?.toLowerCase().includes(filters.search.toLowerCase()) ?? false);
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesVisibility = filters.visibility === 'all' || project.visibility === filters.visibility;
      const matchesTemplate = filters.template === 'all' || project.template === filters.template;
      
      return matchesSearch && matchesStatus && matchesVisibility && matchesTemplate;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return 0;
      }
    });

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0,
        tasksCount: 0,
        completedTasks: 0
      };
      setProjects(prev => [...prev, newProject]);
    } catch (err) {
      setError('Failed to add project. Please try again.');
      console.error('Error adding project:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updatedProject: Project) => {
    setLoading(true);
    setError(null);
    
    try {
      setProjects(prev => prev.map(project => 
        project.id === updatedProject.id 
          ? { ...updatedProject, updatedAt: new Date().toISOString() }
          : project
      ));
    } catch (err) {
      setError('Failed to update project. Please try again.');
      console.error('Error updating project:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      setProjects(prev => prev.filter(project => project.id !== projectId));
    } catch (err) {
      setError('Failed to delete project. Please try again.');
      console.error('Error deleting project:', err);
    } finally {
      setLoading(false);
    }
  };

  const value: ProjectContextType = {
    projects,
    filteredProjects,
    filters,
    setFilters,
    addProject,
    updateProject,
    deleteProject,
    loading,
    error
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}