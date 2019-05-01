import { put, take, all, fork, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../../actions/socket';
import * as uiActions from '../../actions/ui';
import io from 'socket.io-client';

const socket = io('http://localhost:8999');
// const socket = io('http://54.178.145.131');

function* watchOnJudge() {
  while (true) {
    try {
      yield take(socketActions.WATCH_ON_JUDGE);
      yield fork(syncJudge);
      yield fork(writeJudge);
    } catch (err) {
      throw new Error(err);
    }
  }
}

function* syncJudge() {
  while (true) {
    const {
      payload: { roomId },
    } = yield take(socketActions.SYNC_JUDGE);

    yield socket.emit('broadCastJudge', { roomId });
  }
}

function* writeJudge() {
  const channel = yield call(subscribe, socket);

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function subscribe() {
  return eventChannel(emit => {
    const broadCastJudge = async ({ roomId }) => {
      try {
        const myRoomId = window.sessionStorage.getItem('roomId');

        // 他の部屋のブロードキャストは反映しない
        if (myRoomId !== roomId) {
          return;
        }

        emit(
          uiActions.endGame({
            message: 'LOSE',
          })
        );

        window.sessionStorage.removeItem('roomId');
        window.sessionStorage.removeItem('userIds');
        window.sessionStorage.removeItem('p1');
        window.sessionStorage.removeItem('p2');
        window.sessionStorage.removeItem('nextTurn');

        emit(
          socketActions.deleteGameCache({
            roomId,
            userId: window.sessionStorage.getItem('userId'),
          })
        );
      } catch (e) {
        return;
      }
    };

    socket.on('broadCastJudge:receive', broadCastJudge);

    const unsubscribe = () => {
      socket.off('broadCastJudge:receive', broadCastJudge);
    };

    return unsubscribe;
  });
}

export default function* rootSaga() {
  yield all([fork(watchOnJudge)]);
}
