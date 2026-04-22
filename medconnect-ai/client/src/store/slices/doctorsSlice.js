import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    fetchDoctorsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDoctorsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchDoctorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure
} = doctorsSlice.actions;

export default doctorsSlice.reducer;
