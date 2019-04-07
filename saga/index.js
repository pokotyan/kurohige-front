import { fork, all } from 'redux-saga/effects';
import system from './system'
import socket from './socket'
import auth from './auth'

export default function* rootSaga() {
  yield all([
    fork(system),
    fork(socket),
    fork(auth),
  ]);
}
