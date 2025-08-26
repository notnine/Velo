import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface LLMSuggestion {
  action: string;
  parameters: {
    title: string;
    start_date: string;
    end_date: string;
    requires_confirmation: boolean;
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

export interface LLMState {
  isLoading: boolean;
  error: string | null;
  lastResponse: LLMResponse | null;
  messages: Array<{ id: string; message?: string; response?: LLMResponse }>; // chat history
}

const initialState: LLMState = {
  isLoading: false,
  error: null,
  lastResponse: null,
  messages: [],
};

export const sendMessage = createAsyncThunk(
  'llm/sendMessage',
  async ({ message, context }: { message: string; context: any }) => {
    console.log('[LLM] Sending message to backend:', message);
    console.log('[LLM] Context:', context);
    
    try {
      const response = await fetch('http://localhost:8000/api/llm/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[LLM] Backend response:', data);
      
      if (data.suggested_actions && data.suggested_actions.some((a: LLMSuggestion) => a.parameters?.requires_confirmation)) {
        console.log('[LLM] Response requires confirmation.');
      }
      
      return data;
    } catch (error) {
      console.error('[LLM] Backend request failed:', error);
      throw error;
    }
  }
);

const llmSlice = createSlice({
  name: 'llm',
  initialState,
  reducers: {
    clearLastResponse: (state) => {
      state.lastResponse = null;
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
          id: `${Date.now()}`,
          response: action.payload,
        });
        if (action.payload.suggested_actions && action.payload.suggested_actions.some((a: LLMSuggestion) => a.parameters?.requires_confirmation)) {
          console.log('[LLM] Fulfilled: Confirmation required for suggested action.');
        } else {
          console.log('[LLM] Fulfilled: No confirmation required.');
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export default llmSlice.reducer;
export const { clearLastResponse } = llmSlice.actions;
