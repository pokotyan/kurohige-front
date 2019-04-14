export const CREATE_ROOM = Symbol(
  'CREATE_ROOM'
);

export const SELECT_ROOM = Symbol(
  'SELECT_ROOM'
);

export const SET_PLAYER = Symbol(
  'SET_PLAYER'
);

export const SET_NEXT_TURN = Symbol(
  'SET_NEXT_TURN'
);

export const createRoom = payload => ({
  type: CREATE_ROOM,
  payload
});

export const selectRoom = payload => ({
  type: SELECT_ROOM,
  payload
});

export const setPlayer = payload => ({
  type: SET_PLAYER,
  payload
});

export const setNextTurn = payload => ({
  type: SET_NEXT_TURN,
  payload
});
