import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import { put, take, all, fork } from 'redux-saga/effects';
import * as systemActions from '../actions/system';
import * as authActions from '../actions/auth';
import * as socketActions from '../actions/socket';

const _getRoomId = () => {
  let uuid = window.sessionStorage.getItem('roomId');

  if (uuid) {
    return uuid;
  }

  uuid = uuidv1();

  window.sessionStorage.setItem('roomId', uuid);

  return uuid;
};

function* createRoom() {
  for (;;) {
    yield take(systemActions.CREATE_ROOM);

    const roomId = _getRoomId();

    yield put(
      socketActions.createRoom({
        roomId,
      })
    );

    yield put(
      authActions.update({
        roomId,
      })
    );
    yield fork(setPlayer1);
  }
}

function* selectRoom() {
  for (;;) {
    const {
      payload: { roomId },
    } = yield take(systemActions.SELECT_ROOM);

    window.sessionStorage.setItem('roomId', roomId);
    authActions.update({
      roomId,
    });

    yield fork(setPlayer2, roomId);
  }
}

function* setPlayer1() {
  const userId = window.sessionStorage.getItem('userId');

  window.sessionStorage.setItem('p1', userId);

  yield fork(setPlayer, 'p1');
}

function* setPlayer2(roomId) {
  const userId = window.sessionStorage.getItem('userId');

  window.sessionStorage.setItem('p2', userId);

  yield fork(setPlayer, 'p2');

  // 先攻はランダム
  yield put(
    socketActions.syncTurn({
      nextTurn: _.sample(['p1', 'p2']),
      roomId,
    })
  );

  // プレイヤー2まで参加したらそのルームには参加できなくするため消す
  yield put(
    socketActions.deleteRoom({
      roomId,
    })
  );
}

function* setPlayer(player) {
  const userId = window.sessionStorage.getItem('userId');
  const roomId = window.sessionStorage.getItem('roomId');

  yield put(
    socketActions.syncUserRoomRelation({
      userId,
      roomId,
    })
  );

  yield put(
    systemActions.setPlayer({
      [player]: true,
    })
  );
}

export default function* rootSaga() {
  yield all([fork(createRoom), fork(selectRoom)]);
}
