import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Time range interface for various blocked/preferred hours
export interface TimeRange {
  start: string;  // 24-hour format: "HH:mm"
  end: string;    // 24-hour format: "HH:mm"
}

export interface UserPreferences {
  productiveHours: TimeRange;    // Best hours for cognitive tasks
  sleepHours: TimeRange;         // Sleep schedule
  blockedHours: TimeRange[];     // Additional blocked time ranges
}

const initialState: UserPreferences = {
  productiveHours: {
    start: "09:00",
    end: "12:00"
  },
  sleepHours: {
    start: "23:00",
    end: "07:00"
  },
  blockedHours: []  // User can add custom blocked time ranges
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setProductiveHours: (state, action: PayloadAction<TimeRange>) => {
      state.productiveHours = action.payload;
    },
    setSleepHours: (state, action: PayloadAction<TimeRange>) => {
      state.sleepHours = action.payload;
    },
    addBlockedHours: (state, action: PayloadAction<TimeRange>) => {
      state.blockedHours.push(action.payload);
    },
    removeBlockedHours: (state, action: PayloadAction<number>) => {
      state.blockedHours.splice(action.payload, 1);
    },
    updateBlockedHours: (state, action: PayloadAction<{ index: number; range: TimeRange }>) => {
      state.blockedHours[action.payload.index] = action.payload.range;
    },
    // Bulk update all preferences
    updateAllPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setProductiveHours,
  setSleepHours,
  addBlockedHours,
  removeBlockedHours,
  updateBlockedHours,
  updateAllPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer; 