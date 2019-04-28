import * as uiActions from '../actions/ui';

const initialState = {
  isEndGame: false,
  message: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case uiActions.END_GAME:
      return {
        ...state,
        ...{ isEndGame: true, message: action.payload.message },
      };
    default:
      return state;
  }
};
