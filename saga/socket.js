import { put, take, all, fork, call, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as socketActions from '../actions/socket';
import * as authActions from '../actions/auth';
import * as systemActions from '../actions/system';
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










function* watchOnGame() {
  while (true) {
    try {
      const { payload: { userId, roomId } } = yield take(socketActions.WATCH_ON_GAME);
      // redisから現在の状態を取得し、storeに反映させる初期化のタスク。
      yield fork(initGameStatus, { userId, roomId });

      // ボックスを選択した際、自身の選択ボックスの更新と、その選択したボックス情報を他ブラウザにブロードキャストするタスク。
      yield fork(syncGameStatus);

      // webSocketのイベントを待ち受け、socketから受け取ったデータを元にactionをdispatchし、storeを更新するタスク。
      // 上記のinitGameStatus、syncGameStatusのタスクがemitするwebsocketのイベントはサーバー側で受信される。
      // 受信後、サーバー側ではredisからのデータ取得,更新の処理が行われ、 `**:receive`　のwebsocketイベントが送信される。
      // その`**:receive`のイベントを待ち受けるタスク。(websocketとredux-sagaの世界を繋ぐためにeventChannelを用いる)
      yield fork(writeStatus);
    } catch (err) {
      console.error('socket error:', err)
    }
  }
}

function* initGameStatus({ userId, roomId }) {
  // ブラウザがリロードされたときのためにredisから値を取ってきて、reservedBoxのstore更新
  yield socket.emit('initReserve', { roomId });
  // ブラウザがリロードされたときのためにredisから値を取ってきて、selectedBoxのstore更新
  yield socket.emit('initSelected', { userId, roomId });
}

function* syncGameStatus() {
  while (true) {
    const { payload: { boxId, userId, roomId, nextTurn } } = yield take(socketActions.SYNC_RESERVE);

    // reserveBoxのredisを更新、更新した値をbroadcastして、他ブラウザのreseveBoxのstore更新
    yield socket.emit('broadCastReserve', { boxId, userId, roomId, nextTurn });
    // selectedBoxのredisを更新、自身のブラウザのselectedBoxのstore更新
    yield socket.emit('updateSelected', { boxId, userId, roomId, nextTurn });
  }
}

function* writeStatus() {
  const channel = yield call(subscribeForGame, socket);

  while (true) {
    // subscriber関数から渡ってきたデータ(reduxのaction)を取得します。
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

    const broadCastReserveHandler = async (reservedBox) => {
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
    fork(watchOnRooms),
    fork(createRoom),
    fork(deleteRoom),
    fork(watchOnGame),
  ]);
}
