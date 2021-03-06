import { put, fork, all } from 'redux-saga/effects';
import * as socketActions from '../actions/socket';
import system from './system';
import game from './game';
import watchOnSelect from './socket/watchOnSelect';
import watchOnRooms from './socket/watchOnRooms';
import watchOnUsers from './socket/watchOnUsers';
import watchOnTurn from './socket/watchOnTurn';
import watchOnJudge from './socket/watchOnJudge';

export default function* rootSaga() {
  yield all([
    fork(system),
    fork(game),
    fork(watchOnSelect),
    fork(watchOnRooms),
    fork(watchOnUsers),
    fork(watchOnTurn),
    fork(watchOnJudge),
  ]);
  yield put(socketActions.watchOnRooms());
  yield put(socketActions.watchOnUsers());
  yield put(socketActions.watchOnTurn());
  yield put(socketActions.watchOnJudge());
}
