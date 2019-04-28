export const JUDGE_GAME = Symbol('JUDGE_GAME');

export const judgeGame = payload => ({
  type: JUDGE_GAME,
  payload,
});
