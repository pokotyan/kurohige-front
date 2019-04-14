import { fork, all } from 'redux-saga/effects';
import system from './system';
import watchOnSelect from './socket/watchOnSelect';
import watchOnRooms from './socket/watchOnRooms';
import watchOnUsers from './socket/watchOnUsers';
import watchOnTurn from './socket/watchOnTurn';
import auth from './auth';

export default function* rootSaga() {
  yield all([
    fork(system),
    fork(watchOnSelect),
    fork(watchOnRooms),
    fork(watchOnUsers),
    fork(watchOnTurn),
    fork(auth),
  ]);
}
