import { createSlice } from '@reduxjs/toolkit';

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

const initialState = {
  user: loadUser(),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      // LEARN (stop 2/4): Reducer ran. This is a SYNCHRONOUS state change.
      // Inspect `state` (Immer draft). The saga has not run yet.
      debugger;
      state.loading = true;
      state.error = null;
    },
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      // LEARN (stop 4/4): API returned. Reducer writes user + token.
      // After this, useSelector consumers re-render (Login redirects).
      debugger;
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  }
});

export const {
  loginRequest,
  registerRequest,
  authSuccess,
  authFailure,
  logout,
  clearAuthError
} = authSlice.actions;

export default authSlice.reducer;
