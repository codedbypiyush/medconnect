import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api/axios';
import {
  loginRequest,
  registerRequest,
  authSuccess,
  authFailure,
  logout
} from '../slices/authSlice';

function* loginWorker(action) {
  try {
    // LEARN (stop 3/4): Saga worker started. Inspect `action.payload`.
    // The next line will make the HTTP call. Step OVER to watch it happen.
    debugger;
    const { data } = yield call(api.post, '/auth/login', action.payload);
    const { token, ...user } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    yield put(authSuccess({ user, token }));
  } catch (err) {
    yield put(authFailure(err.response?.data?.message || 'Login failed. Please try again.'));
  }
}

function* registerWorker(action) {
  try {
    const { data } = yield call(api.post, '/auth/register', action.payload);
    const { token, ...user } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    yield put(authSuccess({ user, token }));
  } catch (err) {
    yield put(authFailure(err.response?.data?.message || 'Registration failed. Please try again.'));
  }
}

function* logoutWorker() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(registerRequest.type, registerWorker);
  yield takeLatest(logout.type, logoutWorker);
}
