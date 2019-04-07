import * as authActions from '../actions/auth';

const initialState = {
  userId: null,
  roomId: null,
  rooms: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authActions.UPDATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
