import uuidv1 from 'uuid/v1';
import {
  put,
  take,
  all,
  fork,
} from 'redux-saga/effects';
import * as systemActions from '../actions/system';
import * as authActions from '../actions/auth';
import * as socketActions from '../actions/socket';

const getRoomId = () => {
  let uuid = window.sessionStorage.getItem('room');

  if (uuid) {
    return uuid;
  }

  uuid = uuidv1()

  window.sessionStorage.setItem('room', uuid);

  return uuid;
}

function* gameStart() {
  for (;;) {
    yield take(systemActions.GAME_START);

    const roomId = getRoomId();

    yield put(socketActions.createRoom({
      roomId
    }));

    yield put(authActions.update({
      roomId,
    }));
  }
}

export default function* rootSaga() {
  yield all([
    fork(gameStart),
  ]);
}
