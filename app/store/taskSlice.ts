/**
 * Redux slice for managing tasks. Handles task creation, completion toggling, and deletion.
 * Includes loading states and error handling for async operations.
 * Generates unique IDs for new tasks and maintains task metadata.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadStoredTasks } from './middleware/storage';

// Simple UUID generation for React Native
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  scheduledDate: string | null; // ISO string format - start date
  endDate: string | null; // ISO string format - end date for overnight tasks
  startTime: string | null; // Format: "1:00PM"
  endTime: string | null; // Format: "2:00PM"
}

interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ 
      title: string; 
      description: string;
      startDate: Date;
      endDate: Date;
    }>) => {
      const { startDate, endDate } = action.payload;
      const newTask: Task = {
        id: generateUUID(),
        title: action.payload.title,
        description: action.payload.description,
        completed: false,
        createdAt: new Date().toISOString(),
        scheduledDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        startTime: startDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(/\s+/g, ''),
        endTime: endDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(/\s+/g, '')
      };
      state.items.push(newTask);
    },
    updateTaskSchedule: (state, action: PayloadAction<{ 
      id: string; 
      scheduledDate: string | null;
    }>) => {
      const task = state.items.find(item => item.id === action.payload.id);
      if (task) {
        task.scheduledDate = action.payload.scheduledDate;
      }
    },
    updateTaskTime: (state, action: PayloadAction<{
      id: string;
      startTime: string | null;
      endTime: string | null;
    }>) => {
      const task = state.items.find(item => item.id === action.payload.id);
      if (task) {
        task.startTime = action.payload.startTime;
        task.endTime = action.payload.endTime;
      }
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.items.find(item => item.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateTask: (state, action: PayloadAction<{
      id: string;
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
    }>) => {
      const { id, title, description, startDate, endDate } = action.payload;
      const task = state.items.find(item => item.id === id);
      if (task) {
        task.title = title;
        task.description = description;
        task.scheduledDate = startDate.toISOString().split('T')[0];
        task.endDate = endDate.toISOString().split('T')[0];
        task.startTime = startDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(/\s+/g, '');
        task.endTime = endDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(/\s+/g, '');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStoredTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadStoredTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadStoredTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load tasks';
      });
  },
});

export const { addTask, updateTaskSchedule, updateTaskTime, toggleTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer; 