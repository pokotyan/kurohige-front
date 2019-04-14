import { put, take, all, fork, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../../actions/socket';
import * as authActions from '../../actions/auth';
import * as systemActions from '../../actions/system';
import io from 'socket.io-client';

const socket = io('http://localhost:8999');

function* watchOnGame() {
  while (true) {
    try {
      const { payload: { userId, roomId } } = yield take(socketActions.WATCH_ON_GAME);
      yield fork(initGameStatus, { userId, roomId });
      yield fork(syncGameStatus);
      yield fork(writeStatus);
    } catch (err) {
      console.error('socket error:', err)
    }
  }
}

function* initGameStatus({ userId, roomId }) {
  yield socket.emit('initReserve', { roomId });
  yield socket.emit('initSelected', { userId, roomId });
}

function* syncGameStatus() {
  while (true) {
    const { payload: { boxId, userId, roomId, nextTurn } } = yield take(socketActions.SYNC_GAME_STATUS);

    yield socket.emit('broadCastReserve', { boxId, userId, roomId, nextTurn });
    yield socket.emit('updateSelected', { boxId, userId, roomId, nextTurn });
  }
}

function* writeStatus() {
  const channel = yield call(subscribeForGame, socket);

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function subscribeForGame() {
  return eventChannel(emit => {
    const initReserveHandler = async (reservedBox) => {
      emit(socketActions.reserveUpdate({ reservedBox }));
    }

    const initSelectedHandler = async (selectedBox) => {
      emit(socketActions.selectedUpdate({ selectedBox }));
    }

    const updateSelectedHandler = async (selectedBox) => {
      emit(socketActions.selectedUpdate({ selectedBox }));
    }

    const broadCastReserveHandler = async ({ reservedBox, roomId }) => {
      const myRoomId = window.sessionStorage.getItem('roomId');

      // 他の部屋のブロードキャストは反映しない
      if (myRoomId !== roomId) {
        return;
      }

      emit(socketActions.reserveUpdate({ reservedBox }));
    }

    const getRoomsReserveHandler = async (rooms) => {
      emit(authActions.update({ rooms }));
    }

    const updateNextTurnHandler = async (nextTurn) => {
      emit(systemActions.updateNextTurn(nextTurn));      
    }

    socket.on('initReserve:receive', initReserveHandler);
    socket.on('initSelected:receive', initSelectedHandler);
    socket.on('updateSelected:receive', updateSelectedHandler);
    socket.on('broadCastReserve:receive', broadCastReserveHandler);
    socket.on('getRooms:receive', getRoomsReserveHandler);
    socket.on('update:nextTurn', updateNextTurnHandler);

    const unsubscribe = () => {
      socket.off('initReserve:receive', initReserveHandler);
      socket.off('initSelected:receive', initSelectedHandler);
      socket.off('updateSelected:receive', updateSelectedHandler);
      socket.off('broadCastReserve:receive', broadCastReserveHandler);
      socket.off('getRooms:receive', getRoomsReserveHandler);
    }

    return unsubscribe;
  });
}

export default function* rootSaga() {
  yield all([
    fork(watchOnGame),
  ]);
}