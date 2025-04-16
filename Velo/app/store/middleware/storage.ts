/**
 * Storage middleware (keeps store both predicatable & persistent) for Redux that automatically persists tasks and preferences to AsyncStorage.
 * Provides actions to load stored data and handles saving state changes for specific action types.
 * Implements error handling and fallback values for failed operations.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../taskSlice';
import { UserPreferences } from '../preferencesSlice';

// Storage keys
const TASKS_STORAGE_KEY = '@velo/tasks';
const PREFERENCES_STORAGE_KEY = '@velo/preferences';

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

export const loadStoredPreferences = createAsyncThunk(
  'storage/loadStoredPreferences',
  async () => {
    try {
      const prefsJson = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
      return prefsJson ? JSON.parse(prefsJson) as UserPreferences : null;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  }
);

// Middleware to save state changes
export const storageMiddleware = (store: any) => (next: any) => async (action: any) => {
  const result = next(action);
  const state = store.getState();
  
  // Save tasks after any task-related action
  if (action.type?.startsWith('tasks/')) {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks.items));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }
  
  // Save preferences after any preferences-related action
  if (action.type?.startsWith('preferences/')) {
    try {
      await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
  
  return result;
};

// Default export for the middleware
export default storageMiddleware; 