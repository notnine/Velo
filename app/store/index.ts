/**
 * Main Redux (predicatable state-maangement library) store configuration that combines task and preferences reducers (takes current state + action and returns new state).
 * Sets up storage middleware (keeps store predicatable & persistent) for data persistence and loads initial state from storage.
 * Exports TypeScript types for state and dispatch.
 */
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import preferencesReducer from './preferencesSlice';
import { storageMiddleware, loadStoredTasks, loadStoredPreferences } from './middleware/storage';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    preferences: preferencesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for async storage middleware
    }).concat(storageMiddleware),
});

// Load stored data when the store is created
store.dispatch(loadStoredTasks());
store.dispatch(loadStoredPreferences());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 