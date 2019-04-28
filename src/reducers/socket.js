import * as socketActions from '../actions/socket';
import socketDomain from '../domain/socket';

const initialState = {
  reservedBox: {},
  selectedBox: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case socketActions.RESERVE_UPDATE: {
      const domainSeed = {
        ...state,
        reservedBox: action.payload.reservedBox,
      };

      return socketDomain(domainSeed);
    }
    case socketActions.SELECTED_UPDATE: {
      const domainSeed = {
        ...state,
        selectedBox: action.payload.selectedBox,
      };

      return socketDomain(domainSeed);
    }
    default:
      return socketDomain(state);
  }
};
