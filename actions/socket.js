export const WATCH_ON_ROOMS = Symbol(
  'WATCH_ON_ROOMS'
);

export const GAME_START = Symbol(
  'GAME_START'
);

export const CREATE_ROOM = Symbol(
  'CREATE_ROOM'
);

export const DELETE_ROOM = Symbol(
  'DELETE_ROOM'
);

export const SYNC_RESERVE = Symbol(
  'SYNC_RESERVE'
);


export const WATCH_ON_GAME = Symbol(
  'WATCH_ON_GAME'
);

export const RESERVE_UPDATE = Symbol(
  'RESERVE_UPDATE'
);

export const SELECTED_UPDATE = Symbol(
  'SELECTED_UPDATE'
);

export const watchOnRooms = payload => ({
  type: WATCH_ON_ROOMS,
  payload
});

export const gameStart = payload => ({
  type: GAME_START,
  payload
});

export const createRoom = payload => ({
  type: CREATE_ROOM,
  payload
});

export const deleteRoom = payload => ({
  type: DELETE_ROOM,
  payload
});

export const syncReserve = payload => ({
  type: SYNC_RESERVE,
  payload
});

export const watchOnGame = payload => ({
  type: WATCH_ON_GAME,
  payload
})

export const reserveUpdate = payload => ({
  type: RESERVE_UPDATE,
  payload
});

export const selectedUpdate = payload => ({
  type: SELECTED_UPDATE,
  payload
});