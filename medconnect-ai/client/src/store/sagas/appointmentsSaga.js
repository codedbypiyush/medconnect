import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api/axios';
import {
  fetchMyRequest,
  fetchScheduleRequest,
  fetchSuccess,
  fetchFailure,
  setHasProfile,
  cancelRequest,
  updateStatusRequest,
  updateOne
} from '../slices/appointmentsSlice';

function* fetchMyWorker() {
  try {
    const { data } = yield call(api.get, '/appointments/my');
    yield put(fetchSuccess(data));
  } catch (err) {
    yield put(fetchFailure(err.response?.data?.message || 'Failed to load appointments'));
  }
}

function* fetchScheduleWorker() {
  try {
    const { data } = yield call(api.get, '/appointments/doctor/schedule');
    yield put(fetchSuccess(data));
  } catch (err) {
    const msg = err.response?.data?.message || '';
    if (msg.toLowerCase().includes('profile not found')) {
      yield put(setHasProfile(false));
      yield put(fetchFailure(null));
    } else {
      yield put(fetchFailure(msg || 'Failed to load schedule'));
    }
  }
}

function* cancelWorker(action) {
  const id = action.payload;
  try {
    yield call(api.patch, `/appointments/cancel/${id}`);
    yield put(updateOne({ id, changes: { status: 'cancelled' } }));
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert(err.response?.data?.message || 'Failed to cancel');
  }
}

function* updateStatusWorker(action) {
  const { id, status } = action.payload;
  try {
    yield call(api.patch, `/appointments/status/${id}`, { status });
    yield put(updateOne({ id, changes: { status } }));
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert(err.response?.data?.message || 'Update failed');
  }
}

export default function* appointmentsSaga() {
  yield takeLatest(fetchMyRequest.type, fetchMyWorker);
  yield takeLatest(fetchScheduleRequest.type, fetchScheduleWorker);
  yield takeLatest(cancelRequest.type, cancelWorker);
  yield takeLatest(updateStatusRequest.type, updateStatusWorker);
}
