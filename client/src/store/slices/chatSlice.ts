import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, Message, ChatRoom } from '../../types/chat';

const initialState: ChatState = {
  activeRoom: null,
  messages: [],
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.activeRoom = action.payload;
      state.messages = action.payload.messages;
    },
    clearActiveRoom: (state) => {
      state.activeRoom = null;
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setActiveRoom,
  clearActiveRoom,
  addMessage,
  setMessages,
  setLoading,
  setError
} = chatSlice.actions;

export default chatSlice.reducer; 