import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import interactionReducer from './slices/interactionSlice';
import doctorReducer from './slices/doctorSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    interactions: interactionReducer,
    doctors: doctorReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
