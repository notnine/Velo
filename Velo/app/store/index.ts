import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import { storageMiddleware, loadStoredTasks } from './middleware/storage';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for async storage middleware
    }).concat(storageMiddleware),
});

// Load stored tasks when the store is created
store.dispatch(loadStoredTasks());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 