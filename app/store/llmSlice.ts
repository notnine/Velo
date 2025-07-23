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
    // Hardcoded sample LLM response for mini test
    const response = {
      response: "Okay, I’ll schedule Lunch with Sam tomorrow at 2 PM for 1 hour. Shall I confirm this?",
      suggested_actions: [
        {
          action: "create_task",
          parameters: {
            title: "Lunch with Sam",
            start_date: "2025-07-18T14:00:00",
            end_date: "2025-07-18T15:00:00",
            requires_confirmation: true,
            description: "Lunch with Sam at 2 PM for 1 hour."
          }
        }
      ]
    };
    console.log('[LLM] Returning response:', response);
    if (response.suggested_actions && response.suggested_actions.some(a => a.parameters?.requires_confirmation)) {
      console.log('[LLM] Response requires confirmation.');
    }
    return response;
  }
);

const llmSlice = createSlice({
  name: 'llm',
  initialState,
  reducers: {},
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
        if (action.payload.suggested_actions && action.payload.suggested_actions.some(a => a.parameters?.requires_confirmation)) {
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
