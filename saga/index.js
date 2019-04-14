import { fork, all } from 'redux-saga/effects';
import system from './system'
import watchOnGame from './socket/watchOnGame'
import watchOnRooms from './socket/watchOnRooms'
import auth from './auth'

export default function* rootSaga() {
  yield all([
    fork(system),
    fork(watchOnGame),
    fork(watchOnRooms),
    fork(auth),
  ]);
}
