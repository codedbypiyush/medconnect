import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import doctorsReducer from './slices/doctorsSlice';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    doctors: doctorsReducer
  },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);

export default store;
