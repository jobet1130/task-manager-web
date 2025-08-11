'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface KanbanState {
  columns: Column[];
  loading: boolean;
  error: string | null;
}

type KanbanAction =
  | { type: 'SET_COLUMNS'; payload: Column[] }
  | { type: 'MOVE_TASK'; payload: { taskId: string; fromColumnId: string; toColumnId: string } }
  | { type: 'ADD_TASK'; payload: { columnId: string; task: Task } }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: KanbanState = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [],
      color: 'bg-gray-100 border-gray-300'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [],
      color: 'bg-blue-50 border-blue-300'
    },
    {
      id: 'review',
      title: 'Review',
      tasks: [],
      color: 'bg-yellow-50 border-yellow-300'
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [],
      color: 'bg-green-50 border-green-300'
    }
  ],
  loading: false,
  error: null
};

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
    
    case 'MOVE_TASK': {
      const { taskId, fromColumnId, toColumnId } = action.payload;
      const task = state.columns
        .find(col => col.id === fromColumnId)
        ?.tasks.find(t => t.id === taskId);
      
      if (!task) return state;
      
      return {
        ...state,
        columns: state.columns.map(column => {
          if (column.id === fromColumnId) {
            return {
              ...column,
              tasks: column.tasks.filter(t => t.id !== taskId)
            };
          }
          if (column.id === toColumnId) {
            return {
              ...column,
              tasks: [...column.tasks, task]
            };
          }
          return column;
        })
      };
    }
    
    case 'ADD_TASK': {
      const { columnId, task } = action.payload;
      return {
        ...state,
        columns: state.columns.map(column => 
          column.id === columnId
            ? { ...column, tasks: [...column.tasks, task] }
            : column
        )
      };
    }
    
    case 'UPDATE_TASK': {
      const updatedTask = action.payload;
      return {
        ...state,
        columns: state.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        }))
      };
    }
    
    case 'DELETE_TASK': {
      const taskId = action.payload;
      return {
        ...state,
        columns: state.columns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        }))
      };
    }
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

const KanbanContext = createContext<{
  state: KanbanState;
  dispatch: React.Dispatch<KanbanAction>;
} | null>(null);

export const KanbanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);
  
  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};