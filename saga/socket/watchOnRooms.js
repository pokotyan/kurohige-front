import { put, take, all, fork, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../../actions/socket';
import * as authActions from '../../actions/auth';
import io from 'socket.io-client';

const socket = io('http://localhost:8999');
// const socket = io('http://54.178.145.131');


function* watchOnRooms() {
  while (true) {
    try {
      yield take(socketActions.WATCH_ON_ROOMS);
      yield fork(writeRooms);
      yield socket.emit('getRooms');
    } catch (err) {
      console.error('socket error:', err)
    }
  }
}

function* writeRooms() {
  const channel = yield call(subscribe, socket);

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function subscribe() {
  return eventChannel(emit => {
    const getRoomsReceive = async (rooms) => {
      emit(authActions.update({ rooms }));
    }

    const broadCastRoomsReceive = async (rooms) => {
      emit(authActions.update({ rooms }));
    }

    socket.on('getRooms:receive', getRoomsReceive);
    socket.on('broadCastRooms:receive', broadCastRoomsReceive);
    
    const unsubscribe = () => {
      socket.off('getRooms:receive', getRoomsReserve);
      socket.off('broadCastRooms:receive', broadCastRoomsReceive);
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
