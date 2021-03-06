import * as socketActions from '../actions/socket';

const initialState = {
  reservedBox: {},
  selectedBox: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case socketActions.RESERVE_UPDATE: {
      return {
        ...state,
        reservedBox: action.payload.reservedBox,
      };
    }
    case socketActions.SELECTED_UPDATE: {
      return {
        ...state,
        selectedBox: action.payload.selectedBox,
      };
    }
    default:
      return state;
  }
};
