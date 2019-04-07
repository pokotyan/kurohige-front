import {
  put,
  take,
  all,
  fork,
} from 'redux-saga/effects';
import * as authActions from '../actions/auth';

function* saveSession() {
  for (;;) {
    const {
      payload: {
        userId
      }
    } = yield take(authActions.SAVE_SESSION);

    yield put(authActions.update({
      userId,
    }));
  }
}

export default function* rootSaga() {
  yield all([
    fork(saveSession),
  ]);
}
