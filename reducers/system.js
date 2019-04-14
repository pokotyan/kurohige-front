import * as systemActions from '../actions/system';

const initialState = {
};

export default (state = initialState, action) => {
  switch (action.type) {
    case systemActions.SET_PLAYER:
      return {
        ...state, ...action.payload
      };
    case systemActions.UPDATE_NEXT_TURN:
      return {
        ...state,
        ...{ nextTurn: action.payload }
      };
    default:
      return state;
  }
};
