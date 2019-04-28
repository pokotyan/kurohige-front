import { take, all, fork } from 'redux-saga/effects';
import * as gameActions from '../actions/game';

function* judgeGame() {
  for (;;) {
    const {
      payload: { currentSelectBox },
    } = yield take(gameActions.JUDGE_GAME);

    // boxIdは `${y}:${x}`
    currentSelectBox.forEach(boxId => {
      let [y, x] = boxId.split(':');
      let curY = parseInt(y, 10);
      let curX = parseInt(x, 10);

      const countY = currentSelectBox.filter(boxId => {
        return (
          boxId === `${curY}:${curX}` ||
          boxId === `${curY + 1}:${curX}` ||
          boxId === `${curY + 2}:${curX}` ||
          boxId === `${curY + 3}:${curX}` ||
          boxId === `${curY + 4}:${curX}`
        );
      }).length;

      const countX = currentSelectBox.filter(boxId => {
        return (
          boxId === `${curY}:${curX}` ||
          boxId === `${curY}:${curX + 1}` ||
          boxId === `${curY}:${curX + 2}` ||
          boxId === `${curY}:${curX + 3}` ||
          boxId === `${curY}:${curX + 4}`
        );
      }).length;

      const countHidariNaname = currentSelectBox.filter(boxId => {
        return (
          boxId === `${curY}:${curX}` ||
          boxId === `${curY + 1}:${curX + 1}` ||
          boxId === `${curY + 2}:${curX + 2}` ||
          boxId === `${curY + 3}:${curX + 3}` ||
          boxId === `${curY + 4}:${curX + 4}`
        );
      }).length;

      const countMigiNaname = currentSelectBox.filter(boxId => {
        return (
          boxId === `${curY}:${curX}` ||
          boxId === `${curY + 1}:${curX - 1}` ||
          boxId === `${curY + 2}:${curX - 2}` ||
          boxId === `${curY + 3}:${curX - 3}` ||
          boxId === `${curY + 4}:${curX - 4}`
        );
      }).length;

      if (countY === 5) {
        window.alert('縦に並んだ');
      }

      if (countX === 5) {
        window.alert('横に並んだ');
      }

      if (countHidariNaname === 5) {
        window.alert('左斜めに並んだ');
      }

      if (countMigiNaname === 5) {
        window.alert('右斜めに並んだ');
      }
    });
  }
}

export default function* rootSaga() {
  yield all([fork(judgeGame)]);
}
