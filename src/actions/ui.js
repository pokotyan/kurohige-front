export const END_GAME = Symbol('END_GAME');

export const endGame = payload => ({
  type: END_GAME,
  payload,
});
