import { all, fork } from 'redux-saga/effects';
import authSaga from './sagas/authSaga';
import appointmentsSaga from './sagas/appointmentsSaga';
import doctorsSaga from './sagas/doctorsSaga';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(appointmentsSaga), fork(doctorsSaga)]);
}
