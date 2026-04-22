import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api/axios';
import {
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure
} from '../slices/doctorsSlice';

function* fetchDoctorsWorker() {
  try {
    const { data } = yield call(api.get, '/doctors');
    yield put(fetchDoctorsSuccess(data));
  } catch (err) {
    yield put(fetchDoctorsFailure(err.response?.data?.message || 'Failed to load doctors'));
  }
}

export default function* doctorsSaga() {
  yield takeLatest(fetchDoctorsRequest.type, fetchDoctorsWorker);
}
