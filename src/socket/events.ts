// Socket event types and interfaces
export interface TaskUpdateData {
  taskId: string;
  updates: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
    assignee_id?: string;
  };
  updatedBy: string;
}

export interface ProjectUpdateData {
  projectId: string;
  updates: {
    name?: string;
    description?: string;
    status?: string;
  };
  updatedBy: string;
}

export interface CommentData {
  taskId: string;
  comment: {
    id: string;
    content: string;
    author_id: string;
    author_name: string;
    created_at: string;
  };
}

export interface NotificationData {
  id: string;
  type: 'task_assigned' | 'task_updated' | 'project_updated' | 'comment_added' | 'due_date_reminder';
  title: string;
  message: string;
  userId: string;
  relatedId?: string; // task_id, project_id, etc.
  created_at: string;
}

export interface UserStatusData {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

// Socket Events Constants
export const SocketEvents = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // User events
  USER_JOIN: 'user:join',
  USER_LEAVE: 'user:leave',
  USER_STATUS_UPDATE: 'user:status_update',
  USER_TYPING: 'user:typing',
  USER_STOP_TYPING: 'user:stop_typing',
  
  // Task events
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_ASSIGNED: 'task:assigned',
  TASK_STATUS_CHANGED: 'task:status_changed',
  TASK_COMMENT_ADDED: 'task:comment_added',
  
  // Project events
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  PROJECT_DELETED: 'project:deleted',
  PROJECT_MEMBER_ADDED: 'project:member_added',
  PROJECT_MEMBER_REMOVED: 'project:member_removed',
  
  // Notification events
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_CLEAR: 'notification:clear',
  
  // Real-time collaboration
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  DOCUMENT_EDIT: 'document:edit',
  CURSOR_MOVE: 'cursor:move',
  
  // System events
  SYSTEM_MAINTENANCE: 'system:maintenance',
  SYSTEM_UPDATE: 'system:update'
} as const;

// Type for socket event names
export type SocketEventName = typeof SocketEvents[keyof typeof SocketEvents];

// Event payload types
export interface SocketEventPayloads {
  [SocketEvents.TASK_UPDATED]: TaskUpdateData;
  [SocketEvents.PROJECT_UPDATED]: ProjectUpdateData;
  [SocketEvents.TASK_COMMENT_ADDED]: CommentData;
  [SocketEvents.NOTIFICATION_NEW]: NotificationData;
  [SocketEvents.USER_STATUS_UPDATE]: UserStatusData;
  // Add more event payload mappings as needed
}

// Helper functions for event handling
export class SocketEventHandlers {
  static handleTaskUpdate(data: TaskUpdateData, callback?: (data: TaskUpdateData) => void) {
    console.log('Task updated:', data);
    if (callback) callback(data);
  }
  
  static handleProjectUpdate(data: ProjectUpdateData, callback?: (data: ProjectUpdateData) => void) {
    console.log('Project updated:', data);
    if (callback) callback(data);
  }
  
  static handleNewNotification(data: NotificationData, callback?: (data: NotificationData) => void) {
    console.log('New notification:', data);
    if (callback) callback(data);
  }
  
  static handleUserStatusUpdate(data: UserStatusData, callback?: (data: UserStatusData) => void) {
    console.log('User status updated:', data);
    if (callback) callback(data);
  }
}