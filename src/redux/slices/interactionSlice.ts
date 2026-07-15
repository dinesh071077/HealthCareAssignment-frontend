import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface Interaction {
  id?: number;
  doctor_id: number;
  visit_date: string;
  visit_time?: string;
  visit_type: string;
  purpose?: string;
  summary: string;
  sentiment: string;
  products: string[];
  follow_up_date?: string;
  outcome?: string;
  created_at?: string;
}

interface InteractionState {
  list: Interaction[];
  loading: boolean;
  error: string | null;
}

const initialState: InteractionState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchInteractions = createAsyncThunk('interactions/fetchAll', async () => {
  const res = await api.get('/interactions');
  return res.data as Interaction[];
});

export const saveInteraction = createAsyncThunk('interactions/save', async (interaction: Interaction) => {
  const res = await api.post('/interactions', interaction);
  return res.data as Interaction;
});

const interactionSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInteractions.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchInteractions.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Error'; })
      .addCase(saveInteraction.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(saveInteraction.fulfilled, (state, action) => { state.loading = false; state.list.unshift(action.payload); })
      .addCase(saveInteraction.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Error'; });
  },
});

export default interactionSlice.reducer;
