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