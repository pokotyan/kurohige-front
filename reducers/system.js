import * as systemActions from '../actions/system';

const initialState = {
};

export default (state = initialState, action) => {
  switch (action.type) {
    case systemActions.SET_PLAYER:
      return {
        ...state, ...action.payload
      };
    case systemActions.SET_NEXT_TURN: {
      if (action.payload) {
        return {
          ...state,
          ...{ nextTurn: action.payload }
        };  
      }

      return state;
    }
    default:
      return state;
  }
};
