import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  hasProfile: true
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    fetchMyRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchScheduleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.hasProfile = true;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setHasProfile: (state, action) => {
      state.hasProfile = action.payload;
    },
    cancelRequest: () => {},
    updateStatusRequest: () => {},
    updateOne: (state, action) => {
      const { id, changes } = action.payload;
      const idx = state.items.findIndex((a) => a.id === id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...changes };
    },
    clearAppointments: () => initialState
  }
});

export const {
  fetchMyRequest,
  fetchScheduleRequest,
  fetchSuccess,
  fetchFailure,
  setHasProfile,
  cancelRequest,
  updateStatusRequest,
  updateOne,
  clearAppointments
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
