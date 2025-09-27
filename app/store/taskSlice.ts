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

// Helper function to format date in local timezone (avoids UTC conversion issues)
const formatLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  order: number; // Order/priority for timeless tasks (lower number = higher priority)
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
      startDate?: Date;
      endDate?: Date;
    }>) => {
      const { title, description, startDate, endDate } = action.payload;
      
      // Check if this is a timeless task (no dates provided)
      const isTimelessTask = !startDate || !endDate;
      
      // For timeless tasks, assign order based on current timestamp
      // For scheduled tasks, use 0 (no ordering needed)
      const order = isTimelessTask ? Date.now() : 0;

      const newTask: Task = {
        id: generateUUID(),
        title: title,
        description: description,
        completed: false,
        createdAt: new Date().toISOString(),
        scheduledDate: isTimelessTask ? null : formatLocalDateString(startDate),
        endDate: isTimelessTask ? null : formatLocalDateString(endDate),
        startTime: isTimelessTask ? null : startDate!.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(/\s+/g, ''),
        endTime: isTimelessTask ? null : endDate!.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(/\s+/g, ''),
        order: order
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
        task.scheduledDate = formatLocalDateString(startDate);
        task.endDate = formatLocalDateString(endDate);
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
    clearAllTasks: (state) => {
      state.items = [];
    },
    reorderTasks: (state, action: PayloadAction<{ taskId: string; newOrder: number }[]>) => {
      // Update the order of tasks based on the new order array
      action.payload.forEach(({ taskId, newOrder }) => {
        const task = state.items.find(item => item.id === taskId);
        if (task) {
          task.order = newOrder;
        }
      });
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

export const { addTask, updateTaskSchedule, updateTaskTime, toggleTask, deleteTask, updateTask, clearAllTasks, reorderTasks } = taskSlice.actions;
export default taskSlice.reducer; 