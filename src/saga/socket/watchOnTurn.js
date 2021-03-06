import { put, take, all, fork, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../../actions/socket';
import * as systemActions from '../../actions/system';
import io from 'socket.io-client';

// const socket = io('http://localhost');
const socket = io('http://18.179.22.249');

function* watchOnTurn() {
  while (true) {
    try {
      yield take(socketActions.WATCH_ON_TURN);
      yield fork(syncTurn);
      yield fork(writeTurn);
    } catch (err) {
      throw new Error(err);
    }
  }
}

function* syncTurn() {
  while (true) {
    const {
      payload: { nextTurn, roomId },
    } = yield take(socketActions.SYNC_TURN);

    yield socket.emit('broadCastNextTurn', { nextTurn, roomId });
    yield socket.emit('updateNextTurn', { nextTurn, roomId });
  }
}

function* writeTurn() {
  const channel = yield call(subscribe, socket);

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function subscribe() {
  return eventChannel(emit => {
    const updateNextTurn = async ({ nextTurn, roomId }) => {
      try {
        const myRoomId = window.sessionStorage.getItem('roomId');

        // 他の部屋のブロードキャストは反映しない
        if (myRoomId !== roomId) {
          return;
        }

        window.sessionStorage.setItem('nextTurn', nextTurn);
        emit(systemActions.setNextTurn(nextTurn));
      } catch (e) {
        return;
      }
    };

    socket.on('updateNextTurn:receive', updateNextTurn);

    const unsubscribe = () => {
      socket.off('updateNextTurn:receive', updateNextTurn);
    };

    return unsubscribe;
  });
}

export default function* rootSaga() {
  yield all([fork(watchOnTurn)]);
}
