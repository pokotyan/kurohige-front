import { combineReducers } from 'redux';
import socket from './socket';
import auth from './auth';
import system from './system';
import ui from './ui';

const reducer = combineReducers({
  socket,
  auth,
  system,
  ui,
});

export default reducer;
