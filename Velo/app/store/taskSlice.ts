import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface TaskState {
  items: Task[];
}

const initialState: TaskState = {
  items: [],
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ title: string; description: string }>) => {
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newTask);
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
  },
});

export const { addTask, toggleTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer; 