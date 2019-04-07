export const GAME_START = Symbol(
  'GAME_START'
);

export const gameStart = payload => ({
  type: GAME_START,
  payload
});
