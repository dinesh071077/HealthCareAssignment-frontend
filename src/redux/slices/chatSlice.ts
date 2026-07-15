import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isComplete: boolean;
  extractedData: Record<string, unknown> | null;
  sessionId: string;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isComplete: false,
  extractedData: null,
  sessionId: crypto.randomUUID(),
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) {
      state.messages.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setComplete(state, action: PayloadAction<boolean>) {
      state.isComplete = action.payload;
    },
    setExtractedData(state, action: PayloadAction<Record<string, unknown> | null>) {
      state.extractedData = action.payload;
    },
    resetChat(state) {
      state.messages = [];
      state.isLoading = false;
      state.isComplete = false;
      state.extractedData = null;
      state.sessionId = crypto.randomUUID();
    },
  },
});

export const { addMessage, setLoading, setComplete, setExtractedData, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
