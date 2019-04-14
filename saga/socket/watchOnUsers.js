import { put, take, all, fork, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../../actions/socket';
import * as authActions from '../../actions/auth';
import io from 'socket.io-client';

const socket = io('http://localhost:8999');

function* watchOnUsers() {
  while (true) {
    try {
      yield take(socketActions.WATCH_ON_USERS);
      yield fork(syncUserRoomRelation);
      yield fork(writeUserRoomRelation);
    } catch (err) {
      console.error('socket error:', err)
    }
  }
}

function* syncUserRoomRelation() {
  while (true) {
    const { payload: { userId, roomId } } = yield take(socketActions.SYNC_USER_ROOM_RELATION);

    yield socket.emit('broadCastUser', { userId, roomId });
    yield socket.emit('updateUser', { userId, roomId });
  }
}

function* writeUserRoomRelation() {
  const channel = yield call(subscribe, socket);

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function subscribe() {
  return eventChannel(emit => {
    const updateGameMemberHandler = async ({ userIds, roomId }) => {
      const myRoomId = window.sessionStorage.getItem('roomId');

      // 他の部屋のブロードキャストは反映しない
      if (myRoomId !== roomId) {
        return;
      }

      emit(authActions.update({ userIds }));
    }

    socket.on('updateGameMember', updateGameMemberHandler);
    
    const unsubscribe = () => {
      socket.off('updateGameMember', updateGameMemberHandler);
    }

    return unsubscribe;
  });
}

export default function* rootSaga() {
  yield all([
    fork(watchOnUsers),
  ]);
}
