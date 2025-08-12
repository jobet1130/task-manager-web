'use client';

import React from 'react';
import { Card } from '../Common/UI/Card';
import { Button } from '../Common/UI/Button';
import { useTheme } from '@/context/ThemeContext';
import { TeamMember } from './types';

interface TeamMemberCardProps {
  member: TeamMember;
  onViewProfile?: (memberId: string) => void;
  onSendMessage?: (memberId: string) => void;
  showActions?: boolean;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onViewProfile,
  onSendMessage,
  showActions = true
}) => {
  const { isDark } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow duration-200`}>
      <div className="flex items-start space-x-4">
        {/* Avatar with Status */}
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: member.color }}
          >
            {member.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDark ? 'border-gray-800' : 'border-white'} ${getStatusColor(member.status)}`}></div>
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
              {member.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
              {member.role}
            </span>
          </div>
          
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            {member.email}
          </p>
          
          {member.department && (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
              {member.department}
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {member.tasksCompleted}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Completed
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {member.tasksInProgress}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                In Progress
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {member.efficiency}%
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Efficiency
              </div>
            </div>
          </div>

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map((skill, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {skill}
                  </span>
                ))}
                {member.skills.length > 3 && (
                  <span className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    +{member.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile?.(member.id)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
              >
                View Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSendMessage?.(member.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};