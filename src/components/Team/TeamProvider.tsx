'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TeamMember, TeamStats } from './types';

interface TeamContextType {
  members: TeamMember[];
  stats: TeamStats;
  loading: boolean;
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;
  inviteMember: (email: string, role: TeamMember['role']) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
}

export function TeamProvider({ children }: TeamProviderProps) {
  const [loading, setLoading] = useState(false);
  
  // Sample data - replace with actual API calls
  const [members, setMembers] = useState<TeamMember[]>([]);

  const stats: TeamStats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'online').length,
    totalTasksCompleted: members.reduce((sum, member) => sum + member.tasksCompleted, 0),
    averageEfficiency: members.length > 0 
      ? Math.round(members.reduce((sum, member) => sum + member.efficiency, 0) / members.length)
      : 0,
    departmentBreakdown: members.reduce((acc, member) => {
      if (member.department) {
        acc[member.department] = (acc[member.department] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number })
  };

  const addMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: Date.now().toString()
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const inviteMember = async (email: string, role: TeamMember['role']) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Inviting ${email} as ${role}`);
    } catch (error) {
      console.error('Failed to invite member:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeamContext.Provider value={{
      members,
      stats,
      loading,
      addMember,
      updateMember,
      removeMember,
      inviteMember
    }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}