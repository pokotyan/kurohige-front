import { put, take, all, fork, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../../actions/socket';
import * as authActions from '../../actions/auth';
import io from 'socket.io-client';

const socket = io('http://localhost:8999');

function* watchOnRooms() {
  while (true) {
    try {
      yield take(socketActions.WATCH_ON_ROOMS);
      yield fork(syncRooms);
      yield socket.emit('getRooms');
    } catch (err) {
      console.error('socket error:', err)
    }
  }
}

function* syncRooms() {
  const channel = yield call(subscribeForRooms, socket);

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function subscribeForRooms() {
  return eventChannel(emit => {
    const getRoomsReceiveHandler = async (rooms) => {
      emit(authActions.update({ rooms }));
    }

    const broadCastRoomsReceiveHandler = async (rooms) => {
      emit(authActions.update({ rooms }));
    }

    socket.on('getRooms:receive', getRoomsReceiveHandler);
    socket.on('broadCastRooms:receive', broadCastRoomsReceiveHandler);
    
    const unsubscribe = () => {
      socket.off('getRooms:receive', getRoomsReserveHandler);
      socket.off('broadCastRooms:receive', broadCastRoomsReceiveHandler);
    }

    return unsubscribe;
  });
}

function* createRoom() {
  while (true) {
    const { payload: { roomId } } = yield take(socketActions.CREATE_ROOM);

    yield socket.emit('createRoom', { roomId });
  }
}

function* deleteRoom() {
  while (true) {
    const { payload: { roomId } } = yield take(socketActions.DELETE_ROOM);

    yield socket.emit('deleteRoom', { roomId });
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchOnRooms),
    fork(createRoom),
    fork(deleteRoom),
  ]);
}
