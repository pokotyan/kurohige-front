export const WATCH_ON_ROOMS = Symbol('WATCH_ON_ROOMS');

export const GAME_START = Symbol('GAME_START');

export const CREATE_ROOM = Symbol('CREATE_ROOM');

export const DELETE_ROOM = Symbol('DELETE_ROOM');

export const SYNC_SELECT_STATUS = Symbol('SYNC_SELECT_STATUS');

export const WATCH_ON_SELECT = Symbol('WATCH_ON_SELECT');

export const RESERVE_UPDATE = Symbol('RESERVE_UPDATE');

export const SELECTED_UPDATE = Symbol('SELECTED_UPDATE');

export const WATCH_ON_USERS = Symbol('WATCH_ON_USERS');

export const SYNC_USER_ROOM_RELATION = Symbol('SYNC_USER_ROOM_RELATION');

export const WATCH_ON_TURN = Symbol('WATCH_ON_TURN');

export const SYNC_TURN = Symbol('SYNC_TURN');

export const WATCH_ON_JUDGE = Symbol('WATCH_ON_JUDGE');

export const SYNC_JUDGE = Symbol('SYNC_JUDGE');

export const watchOnRooms = payload => ({
  type: WATCH_ON_ROOMS,
  payload,
});

export const gameStart = payload => ({
  type: GAME_START,
  payload,
});

export const createRoom = payload => ({
  type: CREATE_ROOM,
  payload,
});

export const deleteRoom = payload => ({
  type: DELETE_ROOM,
  payload,
});

export const syncSelectStatus = payload => ({
  type: SYNC_SELECT_STATUS,
  payload,
});

export const watchOnSelect = payload => ({
  type: WATCH_ON_SELECT,
  payload,
});

export const reserveUpdate = payload => ({
  type: RESERVE_UPDATE,
  payload,
});

export const selectedUpdate = payload => ({
  type: SELECTED_UPDATE,
  payload,
});

export const watchOnUsers = payload => ({
  type: WATCH_ON_USERS,
  payload,
});

export const syncUserRoomRelation = payload => ({
  type: SYNC_USER_ROOM_RELATION,
  payload,
});

export const watchOnTurn = payload => ({
  type: WATCH_ON_TURN,
  payload,
});

export const syncTurn = payload => ({
  type: SYNC_TURN,
  payload,
});

export const watchOnJudge = payload => ({
  type: WATCH_ON_JUDGE,
  payload,
});

export const syncJudge = payload => ({
  type: SYNC_JUDGE,
  payload,
});
