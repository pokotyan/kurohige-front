import { take, all, fork, put } from 'redux-saga/effects';
import * as gameActions from '../actions/game';
import * as socketActions from '../actions/socket';
import * as uiActions from '../actions/ui';
import * as authActions from '../actions/auth';

function* judgeGame() {
  for (;;) {
    const {
      payload: { currentSelectBox },
    } = yield take(gameActions.JUDGE_GAME);

    // boxIdは `${y}:${x}`
    const isWin = currentSelectBox.some(boxId => {
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
        return true;
      }

      if (countX === 5) {
        return true;
      }

      if (countHidariNaname === 5) {
        return true;
      }

      if (countMigiNaname === 5) {
        return true;
      }

      return false;
    });

    if (isWin) {
      const roomId = window.sessionStorage.getItem('roomId');

      // 相手にLOSEと表示させる
      yield put(
        socketActions.syncJudge({
          roomId,
        })
      );

      yield put(
        uiActions.endGame({
          message: 'WIN',
        })
      );

      // @todo redisの有効期限を設定

      // window.sessionStorage.removeItem('userId');
      window.sessionStorage.removeItem('roomId');
      window.sessionStorage.removeItem('userIds');
      window.sessionStorage.removeItem('p1');
      window.sessionStorage.removeItem('p2');
      window.sessionStorage.removeItem('nextTurn');

      yield put(
        authActions.update({
          // roomId: null,
          rooms: [],
          // userIds: [],
        })
      );
    }
  }
}

export default function* rootSaga() {
  yield all([fork(judgeGame)]);
}
