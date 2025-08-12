export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'online' | 'offline' | 'away';
  tasksCompleted: number;
  tasksInProgress: number;
  efficiency: number;
  joinedAt: string;
  lastActive: string;
  skills?: string[];
  department?: string;
  color: string;
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalTasksCompleted: number;
  averageEfficiency: number;
  departmentBreakdown: { [key: string]: number };
}