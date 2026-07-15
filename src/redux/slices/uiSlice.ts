import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UiState {
  sidebarOpen: boolean;
  darkMode: boolean;
  toasts: Toast[];
  globalLoading: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
  darkMode: false,
  toasts: [],
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({ id: crypto.randomUUID(), ...action.payload });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
  },
});

export const { toggleSidebar, toggleDarkMode, addToast, removeToast, setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
