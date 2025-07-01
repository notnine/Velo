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
      // For now, return a mock response since we don't have LLM integration yet
      // This can be replaced with actual API call when LLM service is available
      console.log('Sending message to LLM:', message, context);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: LLMResponse = {
        response: `I understand you said: "${message}". Based on your current tasks, I can help you organize and manage them better. This is a placeholder response until the LLM service is integrated.`,
        suggested_actions: [
          {
            action: 'create_task',
            parameters: {
              title: 'Example suggested task',
              description: 'This is an example of what the LLM might suggest',
              due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            }
          }
        ]
      };
      
      return mockResponse;
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
