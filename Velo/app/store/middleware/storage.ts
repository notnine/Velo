import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../taskSlice';

// Storage keys
const TASKS_STORAGE_KEY = '@velo/tasks';

// Action types
export const loadStoredTasks = createAsyncThunk(
  'storage/loadStoredTasks',
  async () => {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) as Task[] : [];
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  }
);

// Middleware to save tasks when they change
export const storageMiddleware = (store: any) => (next: any) => async (action: any) => {
  const result = next(action);
  
  // Save tasks after any task-related action
  if (action.type?.startsWith('tasks/')) {
    try {
      const state = store.getState();
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks.items));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }
  
  return result;
}; 