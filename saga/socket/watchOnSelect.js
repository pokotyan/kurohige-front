import { put, take, all, fork, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../../actions/socket';
import * as authActions from '../../actions/auth';
import * as systemActions from '../../actions/system';
import io from 'socket.io-client';

const socket = io('http://localhost:8999');

function* watchOnSelect() {
  while (true) {
    try {
      const { payload: { userId, roomId } } = yield take(socketActions.WATCH_ON_SELECT);
      yield fork(initSelectStatus, { userId, roomId });
      yield fork(syncSelectStatus);
      yield fork(writeSelectStatus);
    } catch (err) {
      console.error('socket error:', err)
    }
  }
}

function* initSelectStatus({ userId, roomId }) {
  yield socket.emit('initReserve', { roomId });
  yield socket.emit('initSelected', { userId, roomId });
}

function* syncSelectStatus() {
  while (true) {
    const { payload: { boxId, userId, roomId } } = yield take(socketActions.SYNC_SELECT_STATUS);

    yield socket.emit('broadCastReserve', { boxId, userId, roomId });
    yield socket.emit('updateSelected', { boxId, userId, roomId });
  }
}

function* writeSelectStatus() {
  const channel = yield call(subscribe, socket);

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function subscribe() {
  return eventChannel(emit => {
    const initReserve = async (reservedBox) => {
      emit(socketActions.reserveUpdate({ reservedBox }));
    }

    const initSelected = async (selectedBox) => {
      emit(socketActions.selectedUpdate({ selectedBox }));
    }

    const updateSelected = async (selectedBox) => {
      emit(socketActions.selectedUpdate({ selectedBox }));
    }

    const broadCastReserve = async ({ reservedBox, roomId }) => {
      const myRoomId = window.sessionStorage.getItem('roomId');

      // 他の部屋のブロードキャストは反映しない
      if (myRoomId !== roomId) {
        return;
      }

      emit(socketActions.reserveUpdate({ reservedBox }));
    }

    const getRoomsReserve = async (rooms) => {
      emit(authActions.update({ rooms }));
    }

    socket.on('initReserve:receive', initReserve);
    socket.on('initSelected:receive', initSelected);
    socket.on('updateSelected:receive', updateSelected);
    socket.on('broadCastReserve:receive', broadCastReserve);
    socket.on('getRooms:receive', getRoomsReserve);

    const unsubscribe = () => {
      socket.off('initReserve:receive', initReserve);
      socket.off('initSelected:receive', initSelected);
      socket.off('updateSelected:receive', updateSelected);
      socket.off('broadCastReserve:receive', broadCastReserve);
      socket.off('getRooms:receive', getRoomsReserve);
    }

    return unsubscribe;
  });
}

export default function* rootSaga() {
  yield all([
    fork(watchOnSelect),
  ]);
}
