import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface LLMSuggestion {
  action: string;
  parameters: {
    title: string;
    description?: string;
    due_date?: string;
    [key: string]: any;
  };
}

export interface LLMResponse {
  response: string;
  suggested_actions?: LLMSuggestion[];
  error?: string;
}

interface LLMState {
  isLoading: boolean;
  lastResponse: LLMResponse | null;
  error: string | null;
  messages: Array<{
    id: string;
    message: string;
    response: LLMResponse | null;
    timestamp: number;
  }>;
}

const initialState: LLMState = {
  isLoading: false,
  lastResponse: null,
  error: null,
  messages: [],
};

interface SendMessagePayload {
  message: string;
  context: {
    current_tasks: Array<{
      title: string;
      description: string;
      due_date: string | null;
      completed: boolean;
    }>;
  };
}

// Async thunk for sending messages to LLM
export const sendMessage = createAsyncThunk(
  'llm/sendMessage',
  async ({ message, context }: SendMessagePayload, { rejectWithValue }) => {
    try {
      // Call FastAPI backend
      const response = await fetch('http://10.88.111.53:8000/api/llm/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.error || 'Failed to get response from assistant');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send message');
    }
  }
);

const llmSlice = createSlice({
  name: 'llm',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastResponse: (state) => {
      state.lastResponse = null;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastResponse = action.payload;
        state.messages.push({
          id: Date.now().toString(),
          message: action.meta.arg.message,
          response: action.payload,
          timestamp: Date.now(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.lastResponse = null;
      });
  },
});

export const { clearError, clearLastResponse, clearMessages } = llmSlice.actions;
export default llmSlice.reducer;
