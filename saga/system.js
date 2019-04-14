import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import {
  put,
  take,
  all,
  fork,
} from 'redux-saga/effects';
import * as systemActions from '../actions/system';
import * as authActions from '../actions/auth';
import * as socketActions from '../actions/socket';

const _getRoomId = () => {
  let uuid = window.sessionStorage.getItem('roomId');

  if (uuid) {
    return uuid;
  }

  uuid = uuidv1()

  window.sessionStorage.setItem('roomId', uuid);

  return uuid;
}

function* createRoom() {
  for (;;) {
    yield take(systemActions.CREATE_ROOM);

    const roomId = _getRoomId();

    yield put(socketActions.createRoom({
      roomId
    }));

    yield put(authActions.update({
      roomId,
    }));
    yield fork(setPlayer1);
  }
}

function* selectRoom() {
  for (;;) {
    const {
      payload: {
        roomId
      }
    } = yield take(systemActions.SELECT_ROOM);

    window.sessionStorage.setItem('roomId', roomId);
    authActions.update({
      roomId
    });

    yield fork(setPlayer2, roomId);
  }
}

function* setPlayer1() {
  const userId = window.sessionStorage.getItem('userId');

  window.sessionStorage.setItem('p1', userId);

  yield put(systemActions.setPlayer({
    p1: true
  }));
}

function* setPlayer2(roomId) {
  const userId = window.sessionStorage.getItem('userId');

  window.sessionStorage.setItem('p2', userId);

  yield put(systemActions.setPlayer({
    p2: true
  }));

  // 先攻はランダム
  // ＠todo 先攻がどっちかをブロードキャストしないといけない
  // yield put(systemActions.updateNextTurn(_.sample(['p1', 'p2'])));

  // プレイヤー2まで参加したらそのルームには参加できなくするため消す
  yield put(socketActions.deleteRoom({
    roomId
  }));
}

function* updateNextTurn() {
  for (;;) {
    const {
      payload: nextTurn
    } = yield take(systemActions.UPDATE_NEXT_TURN);

    window.sessionStorage.setItem('nextTurn', nextTurn);

    yield put(systemActions.setNextTurn(nextTurn));
  }
}

export default function* rootSaga() {
  yield all([
    fork(createRoom),
    fork(selectRoom),
    fork(updateNextTurn),
  ]);
}
