import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  hospital: string;
}

interface DoctorState {
  list: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchDoctors = createAsyncThunk('doctors/fetchAll', async () => {
  const res = await api.get('/doctors');
  return res.data as Doctor[];
});

export const createDoctor = createAsyncThunk('doctors/create', async (doctor: Omit<Doctor, 'id'>) => {
  const res = await api.post('/doctors', doctor);
  return res.data as Doctor;
});

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => { state.loading = true; })
      .addCase(fetchDoctors.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchDoctors.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Error'; })
      .addCase(createDoctor.fulfilled, (state, action) => { state.list.push(action.payload); });
  },
});

export default doctorSlice.reducer;
